import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { env } from "cloudflare:workers";

import { getAppSession, hashPassword, verifyPassword } from "./auth.server";
import type { SessionUser } from "./auth.server";
import { getDb } from "./db.server";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(200)
  .email("Enter a valid email address.");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(200);

const nameSchema = z.string().trim().min(1, "Name is required.").max(120);

// ---------------------------------------------------------------------------
// Register (client sign-up — public)
// ---------------------------------------------------------------------------
const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const registerFn = createServerFn({ method: "POST" })
  .validator(registerSchema)
  .handler(async ({ data }) => {
    const db = getDb();

    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ?1")
      .bind(data.email)
      .first<{ id: number }>();
    if (existing) {
      return { error: "An account with this email already exists." } as const;
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db
      .prepare(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?1, ?2, ?3, 'client')
         RETURNING id, name, email, role`,
      )
      .bind(data.name, data.email, passwordHash)
      .first<SessionUser>();

    if (!user) {
      return { error: "Could not create your account. Please try again." } as const;
    }

    const session = await getAppSession();
    await session.update({ user });
    return { success: true, user } as const;
  });

// ---------------------------------------------------------------------------
// Login (shared by clients and admins — role decides where the UI sends them)
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginFn = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const db = getDb();

    const row = await db
      .prepare("SELECT id, name, email, role, password_hash FROM users WHERE email = ?1")
      .bind(data.email)
      .first<SessionUser & { password_hash: string }>();

    // Same generic error whether the email doesn't exist or the password is
    // wrong — don't leak which accounts exist.
    if (!row) {
      return { error: "Invalid email or password." } as const;
    }

    const valid = await verifyPassword(data.password, row.password_hash);
    if (!valid) {
      return { error: "Invalid email or password." } as const;
    }

    const user: SessionUser = { id: row.id, name: row.name, email: row.email, role: row.role };
    const session = await getAppSession();
    await session.update({ user });
    return { success: true, user } as const;
  });

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAppSession();
  await session.clear();
  return { success: true } as const;
});

// ---------------------------------------------------------------------------
// Current user (used by route guards)
// ---------------------------------------------------------------------------
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAppSession();
  return session.data.user ?? null;
});

// ---------------------------------------------------------------------------
// One-time admin bootstrap. Gated by the ADMIN_SETUP_TOKEN secret so random
// visitors can't create themselves an admin account. Locks itself once an
// admin already exists.
// ---------------------------------------------------------------------------
const setupAdminSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  setupToken: z.string().min(1, "Setup token is required."),
});

export const setupAdminFn = createServerFn({ method: "POST" })
  .validator(setupAdminSchema)
  .handler(async ({ data }) => {
    const expectedToken = env.ADMIN_SETUP_TOKEN;
    if (!expectedToken) {
      return {
        error: "Admin setup is disabled (ADMIN_SETUP_TOKEN is not configured on the server).",
      } as const;
    }
    if (data.setupToken !== expectedToken) {
      return { error: "Invalid setup token." } as const;
    }

    const db = getDb();

    const existingAdmin = await db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .first<{ id: number }>();
    if (existingAdmin) {
      return { error: "An admin account already exists. Setup is locked." } as const;
    }

    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ?1")
      .bind(data.email)
      .first<{ id: number }>();
    if (existing) {
      return { error: "An account with this email already exists." } as const;
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db
      .prepare(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?1, ?2, ?3, 'admin')
         RETURNING id, name, email, role`,
      )
      .bind(data.name, data.email, passwordHash)
      .first<SessionUser>();

    if (!user) {
      return { error: "Could not create the admin account. Please try again." } as const;
    }

    const session = await getAppSession();
    await session.update({ user });
    return { success: true, user } as const;
  });
