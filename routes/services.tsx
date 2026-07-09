import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { services, priceRange } from "@/lib/services-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Thuraya Studio" },
      { name: "description", content: "Websites, digital menus, logos, brochures and full branding packages for UAE businesses. Transparent AED pricing." },
      { property: "og:title", content: "Services & Pricing — Thuraya Studio" },
      { property: "og:description", content: "Transparent AED pricing on web, brand and print services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="container-x py-20">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-secondary">Services</div>
        <h1 className="mt-3 text-5xl md:text-6xl text-primary text-balance">
          Design work, priced fairly.
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Every package is tailored to your business. Prices in AED — final scope confirmed after a short brief.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((s, i) => (
          <div
            key={s.id}
            className="group relative rounded-3xl bg-card p-8 ring-soft hover:-translate-y-1 transition-all"
            style={{ animation: `rise-in .6s ${i * 0.05}s both` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Service 0{i + 1}</div>
                <h2 className="mt-2 text-2xl md:text-3xl text-primary">{s.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">{s.tagline}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Starting</div>
                <div className="font-display text-2xl text-secondary">{priceRange(s)}</div>
              </div>
            </div>
            <ul className="mt-6 grid gap-2 text-sm">
              {s.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-2">
              <Link
                to="/project-builder"
                search={{ service: s.id } as never}
                className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-95"
              >
                Start with this
              </Link>
              <Link to="/pricing" className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted">
                Estimate
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
