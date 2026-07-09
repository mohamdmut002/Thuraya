import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { setupAdminFn } from "@/lib/auth-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/setup")({
  head: () => ({
    meta: [{ title: "Admin Setup — Thuraya Studio" }],
  }),
  component: AdminSetupPage,
});

function AdminSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await setupAdminFn({ data: { name, email, password, setupToken } });
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success("Admin account created.");
      await router.invalidate();
      router.navigate({ to: "/admin" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-20 max-w-md mx-auto animate-rise">
      <h1 className="text-3xl mb-2 text-primary">One-time admin setup</h1>
      <p className="text-muted-foreground mb-8">
        This only works once — it locks itself the moment an admin account exists. You need the{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">ADMIN_SETUP_TOKEN</code> secret to use
        it.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="setupToken">Setup token</Label>
          <Input
            id="setupToken"
            type="password"
            required
            value={setupToken}
            onChange={(e) => setSetupToken(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create admin account"}
        </Button>
      </form>
    </div>
  );
}
