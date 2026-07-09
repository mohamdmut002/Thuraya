import { env } from "cloudflare:workers";
import { useSession } from "@tanstack/react-start/server";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "client";
};

type SessionData = { user?: SessionUser };

function getSessionSecret(): string {
  const secret = env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or shorter than 32 characters. Set it as a Secret in " +
        "Cloudflare → Worker → Settings → Variables and Secrets (production), and in " +
        ".dev.vars for local `wrangler dev`. Generate one with: openssl rand -hex 32",
    );
  }
  return secret;
}

/** Encrypted, signed, httpOnly session cookie — no server-side session table needed. */
export function getAppSession() {
  return useSession<SessionData>({
    password: getSessionSecret(),
    name: "thuraya_session",
    cookie: {
      secure: true,
      sameSite: "lax",
    },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Cloudflare Workers' Web Crypto implementation caps PBKDF2 at 100,000
// iterations (crypto.subtle.deriveBits throws above that) — unlike Node.js,
// which allows much higher counts. 100,000 is still solid for PBKDF2-SHA256.
const PBKDF2_ITERATIONS = 100_000;

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const b of arr) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Hashes a password with PBKDF2-SHA256 (native Web Crypto — no extra dependency). */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return `pbkdf2:${PBKDF2_ITERATIONS}:${toBase64(salt)}:${toBase64(derivedBits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const salt = fromBase64(parts[2]);
  const expected = fromBase64(parts[3]);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const actual = new Uint8Array(derivedBits);

  if (actual.length !== expected.length) return false;
  // Constant-time comparison to avoid leaking timing information.
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}
