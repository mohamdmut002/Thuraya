import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { getCurrentUserFn, logoutFn } from "@/lib/auth-fns";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Client Dashboard — Thuraya Studio" },
      {
        name: "description",
        content: "Track your project's progress, upload files and read updates from the Thuraya team.",
      },
    ],
  }),
  beforeLoad: async () => {
    const user = await getCurrentUserFn();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== "client") {
      throw redirect({ to: "/admin" });
    }
    return { user };
  },
  component: Dashboard,
});

function Dashboard() {
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
          <h1 className="text-3xl text-primary">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Sign out
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 ring-soft">
        <h2 className="text-xl mb-2">Project tracking is coming soon</h2>
        <p className="text-muted-foreground max-w-xl">
          You&apos;re securely signed in — this confirms real authentication is working end to
          end (Cloudflare D1 + encrypted sessions). Project submissions, file uploads, invoices
          and messaging will be added here next.
        </p>
      </div>
    </div>
  );
}
