import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Palette, Globe, Utensils, FileText, Star, Check } from "lucide-react";
import { services, priceRange } from "@/lib/services-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thuraya — Creative Digital Studio in the UAE" },
      { name: "description", content: "Websites, digital menus, logos and brand identities crafted for modern UAE businesses. Start from AED 50." },
      { property: "og:title", content: "Thuraya — Creative Digital Studio in the UAE" },
      { property: "og:description", content: "Affordable, elegant design for restaurants, cafes, startups and small businesses." },
    ],
  }),
  component: Home,
});

const highlights = [
  { icon: Globe, label: "Websites" },
  { icon: Utensils, label: "Digital Menus" },
  { icon: Palette, label: "Branding" },
  { icon: FileText, label: "Print" },
];

function Home() {
  const featured = services.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden grain-bg">
        <div className="container-x pt-20 pb-24 md:pt-28 md:pb-32 relative">
          <div className="max-w-3xl animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="tracking-wide text-muted-foreground">UAE-based creative studio</span>
            </div>
            <h1 className="mt-6 text-balance text-4xl md:text-6xl lg:text-7xl leading-[1.02] text-primary">
              Creative Digital Solutions{" "}
              <span className="italic text-secondary">For Modern Businesses</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              We design websites, menus, logos, and digital identities that help your
              business grow — considered, calm, and always on-brand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/project-builder"
                className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium ring-soft hover:opacity-95"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 backdrop-blur px-6 py-3 text-sm font-medium text-primary hover:bg-background"
              >
                View Services
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-center gap-2">
                  <h.icon className="h-4 w-4 text-secondary" />
                  {h.label}
                </div>
              ))}
            </div>
          </div>

          {/* Decorative card */}
          <div className="pointer-events-none hidden lg:block absolute right-8 top-24 w-[360px] animate-float">
            <div className="rounded-3xl bg-background ring-soft p-6 rotate-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>Case 001</span>
                <span>2026</span>
              </div>
              <div className="mt-6 font-display text-3xl text-primary">Layla&nbsp;Café</div>
              <div className="mt-1 text-sm text-muted-foreground">Brand & digital menu</div>
              <div className="mt-6 grid grid-cols-4 gap-2">
                <div className="h-14 rounded-lg bg-primary" />
                <div className="h-14 rounded-lg bg-secondary" />
                <div className="h-14 rounded-lg bg-accent" />
                <div className="h-14 rounded-lg bg-mist border border-border" />
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Palette · Type · Menu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="border-y border-border/60 bg-background">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
          {[
            { k: "40+", v: "Projects delivered" },
            { k: "AED 50", v: "Starting from" },
            { k: "7 days", v: "Avg. delivery" },
            { k: "5.0", v: "Client rating" },
          ].map((s) => (
            <div key={s.v} className="p-6 text-center">
              <div className="font-display text-3xl text-primary">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="container-x py-20">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-secondary">Services</div>
            <h2 className="mt-2 text-4xl md:text-5xl text-primary">What we make</h2>
          </div>
          <Link to="/services" className="text-sm text-primary underline underline-offset-4 hover:text-secondary">
            See everything →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((s, i) => (
            <div
              key={s.id}
              className="group relative rounded-3xl bg-card p-7 ring-soft transition-all hover:-translate-y-1"
              style={{ animation: `rise-in .6s ${i * 0.1}s both` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">0{i + 1}</span>
                <Star className="h-4 w-4 text-accent fill-accent" />
              </div>
              <h3 className="mt-6 text-2xl text-primary">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
              <div className="mt-6 font-display text-lg text-secondary">{priceRange(s)}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {s.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-2 text-foreground/80">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground p-10 md:p-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-secondary/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-accent">Let's build</div>
            <h3 className="mt-3 text-3xl md:text-5xl text-balance">
              Ready to give your brand the identity it deserves?
            </h3>
            <p className="mt-4 text-primary-foreground/80 max-w-lg">
              Tell us about your business in a short brief — we'll respond within 24 hours with a plan and a quote.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/project-builder" className="rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:opacity-95">
                Start a project
              </Link>
              <Link to="/pricing" className="rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium hover:bg-primary-foreground/10">
                Estimate a price
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
