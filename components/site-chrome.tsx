import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Star } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/project-builder", label: "Start Project" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:rotate-12">
            <Star className="h-4 w-4 fill-accent stroke-accent" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-tight">Thuraya</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              thuraya.ads
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-1.5 text-foreground/70 transition-colors hover:text-foreground hover:bg-muted"
              activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/project-builder"
          className="hidden md:inline-flex items-center rounded-full bg-accent text-accent-foreground px-4 py-2 text-sm font-medium ring-soft hover:opacity-95"
        >
          Start Project
        </Link>
      </div>
      <nav className="md:hidden container-x pb-3 flex flex-wrap gap-1 text-xs">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="rounded-full px-2.5 py-1 text-foreground/70 hover:bg-muted"
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            activeOptions={{ exact: n.to === "/" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="container-x py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-primary">
              <Star className="h-4 w-4 fill-primary" />
            </span>
            <div>
              <div className="font-display text-lg">Thuraya</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/70">
                thuraya.ads
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70 max-w-xs">
            A UAE creative studio designing calm, considered digital identities for
            modern businesses.
          </p>
        </div>
        <div className="text-sm space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Studio</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> United Arab Emirates</div>
          <a href="mailto:ThurayaADS.inquiries@gmail.com" className="flex items-center gap-2 hover:text-accent">
            <Mail className="h-4 w-4 text-accent" /> ThurayaADS.inquiries@gmail.com
          </a>
          <div className="flex items-center gap-2"><Instagram className="h-4 w-4 text-accent" /> @thuraya.ads</div>
        </div>
        <div className="text-sm space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Explore</div>
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="block text-primary-foreground/80 hover:text-accent">
              {n.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x py-5 text-xs text-primary-foreground/60 flex flex-wrap justify-between gap-2">
          <div>© {new Date().getFullYear()} Thuraya Studio. All rights reserved.</div>
          <div>Designed & built in the UAE.</div>
        </div>
      </div>
    </footer>
  );
}
