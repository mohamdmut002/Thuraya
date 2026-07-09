import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { getCurrentUserFn, logoutFn } from "@/lib/auth-fns";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin — Thuraya Studio" }],
  }),
  beforeLoad: async () => {
    const user = await getCurrentUserFn();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
    return { user };
  },
  component: AdminHome,
});

function AdminHome() {
  const { user } = Route.useRouteContext();
  const router = useRouter();

  const onLogout = async () => {
    await logoutFn();
    toast.success("Signed out.");
    await router.invalidate();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="container-x py-16 animate-rise">
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl text-primary">Admin</h1>
          <p className="text-muted-foreground mt-1">
            Signed in as {user.name} ({user.email})
          </p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Sign out
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 ring-soft">
        <h2 className="text-xl mb-2">Authentication is live</h2>
        <p className="text-muted-foreground max-w-xl">
          Role-based access is working — only accounts with role{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">admin</code> can reach this page.
          Project management, quotations, invoices and the rest of the admin toolkit come next.
        </p>
      </div>
    </div>
  );
}
