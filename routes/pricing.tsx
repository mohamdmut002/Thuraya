import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { services } from "@/lib/services-data";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Calculator — Thuraya Studio" },
      { name: "description", content: "Estimate your project cost in AED. Customize scope, add-ons and delivery speed." },
    ],
  }),
  component: Pricing,
});

type AddOn = { id: string; label: string; price: number };
const addOns: AddOn[] = [
  { id: "copy", label: "Copywriting", price: 80 },
  { id: "photo", label: "Photography direction", price: 120 },
  { id: "extra-page", label: "Extra page (each)", price: 60 },
  { id: "ar", label: "Arabic localization", price: 90 },
  { id: "seo", label: "SEO setup", price: 100 },
];

function Pricing() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [pages, setPages] = useState(3);
  const [rush, setRush] = useState(false);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const svc = services.find((s) => s.id === serviceId)!;

  const estimate = useMemo(() => {
    const base = (svc.priceMin + svc.priceMax) / 2;
    const pageAdj = svc.id.includes("website") ? Math.max(0, pages - 3) * 60 : 0;
    const addOnTotal = addOns.filter((a) => picked[a.id]).reduce((n, a) => n + a.price, 0);
    const rushFee = rush ? Math.round(base * 0.25) : 0;
    const subtotal = base + pageAdj + addOnTotal + rushFee;
    return { base, pageAdj, addOnTotal, rushFee, subtotal };
  }, [svc, pages, picked, rush]);

  return (
    <div className="container-x py-20">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-secondary">Pricing calculator</div>
        <h1 className="mt-3 text-5xl md:text-6xl text-primary text-balance">Estimate your project.</h1>
        <p className="mt-4 text-muted-foreground text-lg">Adjust scope, add-ons and delivery speed — get an instant range in AED.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl bg-card p-6 md:p-10 ring-soft space-y-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Service</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServiceId(s.id)}
                  className={`text-left rounded-2xl border p-4 transition ${
                    s.id === serviceId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className={`text-xs mt-1 ${s.id === serviceId ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    AED {s.priceMin}–{s.priceMax}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {svc.id.includes("website") && (
            <div>
              <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                <span>Pages</span><span>{pages}</span>
              </div>
              <input type="range" min={1} max={10} value={pages} onChange={(e) => setPages(+e.target.value)} className="w-full accent-primary" />
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Add-ons</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {addOns.map((a) => {
                const active = !!picked[a.id];
                return (
                  <button
                    key={a.id}
                    onClick={() => setPicked((p) => ({ ...p, [a.id]: !p[a.id] }))}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                      active ? "border-accent bg-accent/20" : "border-border hover:bg-muted"
                    }`}
                  >
                    <span>{a.label}</span>
                    <span className="text-xs text-muted-foreground">+AED {a.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} className="h-4 w-4 accent-primary" />
            Rush delivery (+25%)
          </label>
        </div>

        <aside className="rounded-3xl bg-primary text-primary-foreground p-8 h-fit ring-soft sticky top-24">
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent">Estimate</div>
          <div className="mt-4 font-display text-5xl text-accent">AED {Math.round(estimate.subtotal)}</div>
          <div className="text-primary-foreground/70 text-sm mt-1">indicative — confirmed after brief</div>
          <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
            <li className="flex justify-between"><span>Base ({svc.name})</span><span>AED {Math.round(estimate.base)}</span></li>
            {estimate.pageAdj > 0 && <li className="flex justify-between"><span>Extra pages</span><span>+AED {estimate.pageAdj}</span></li>}
            {estimate.addOnTotal > 0 && <li className="flex justify-between"><span>Add-ons</span><span>+AED {estimate.addOnTotal}</span></li>}
            {estimate.rushFee > 0 && <li className="flex justify-between"><span>Rush</span><span>+AED {estimate.rushFee}</span></li>}
          </ul>
          <Link to="/project-builder" className="mt-8 inline-flex rounded-full bg-accent text-accent-foreground px-5 py-3 text-sm font-medium">
            Continue to brief
          </Link>
        </aside>
      </div>
    </div>
  );
}
