import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Thuraya Studio" },
      { name: "description", content: "Selected work across websites, logos, menus and full brand identities for UAE businesses." },
    ],
  }),
  component: Portfolio,
});

const categories = ["All", "Websites", "Logos", "Menus", "Branding"] as const;
type Cat = (typeof categories)[number];

type Work = { title: string; client: string; category: Exclude<Cat, "All">; palette: string[]; year: string };
const works: Work[] = [
  { title: "Coastline", client: "Marina Bistro", category: "Websites", palette: ["#1B2A41", "#4F6D8A", "#D9A7B0"], year: "2026" },
  { title: "Layla Café", client: "Al Ain", category: "Branding", palette: ["#1B2A41", "#EAF1F7", "#D9A7B0"], year: "2026" },
  { title: "Noor Bakery", client: "Dubai Marina", category: "Menus", palette: ["#4F6D8A", "#EAF1F7", "#D9A7B0"], year: "2025" },
  { title: "Atlas", client: "Startup studio", category: "Logos", palette: ["#1B2A41", "#4F6D8A", "#EAF1F7"], year: "2025" },
  { title: "Rima Skincare", client: "Sharjah", category: "Branding", palette: ["#D9A7B0", "#1B2A41", "#EAF1F7"], year: "2025" },
  { title: "Kaf Studio", client: "Portfolio site", category: "Websites", palette: ["#1B2A41", "#4F6D8A", "#EAF1F7"], year: "2025" },
  { title: "Yasmine", client: "Florist mark", category: "Logos", palette: ["#4F6D8A", "#D9A7B0", "#EAF1F7"], year: "2024" },
  { title: "Bait Al Qahwa", client: "Coffee house", category: "Menus", palette: ["#1B2A41", "#D9A7B0", "#EAF1F7"], year: "2024" },
];

function Portfolio() {
  const [cat, setCat] = useState<Cat>("All");
  const filtered = cat === "All" ? works : works.filter((w) => w.category === cat);

  return (
    <div className="container-x py-20">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-secondary">Portfolio</div>
        <h1 className="mt-3 text-5xl md:text-6xl text-primary text-balance">Selected work.</h1>
        <p className="mt-4 text-muted-foreground text-lg">A quiet collection of recent projects across the UAE.</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm border transition ${
              cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w, i) => (
          <article
            key={w.title}
            className="group rounded-3xl bg-card ring-soft overflow-hidden hover:-translate-y-1 transition-all"
            style={{ animation: `rise-in .6s ${i * 0.05}s both` }}
          >
            <div
              className="aspect-[4/5] relative"
              style={{
                background: `linear-gradient(135deg, ${w.palette[0]} 0%, ${w.palette[1]} 60%, ${w.palette[2]} 100%)`,
              }}
            >
              <div className="absolute inset-0 grid place-items-center">
                <div className="font-display text-white/90 text-4xl tracking-tight text-center px-6">
                  {w.title}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-1">
                {w.palette.map((c) => (
                  <span key={c} className="h-4 w-4 rounded-full border border-white/50" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-primary">{w.client}</div>
                <div className="text-xs text-muted-foreground">{w.category} · {w.year}</div>
              </div>
              <span className="text-xs uppercase tracking-widest text-secondary">Case</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
