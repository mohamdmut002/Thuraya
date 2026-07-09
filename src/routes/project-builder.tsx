import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { services, priceRange } from "@/lib/services-data";
import { Upload, X, Send } from "lucide-react";

export const Route = createFileRoute("/project-builder")({
  head: () => ({
    meta: [
      { title: "Start Your Project — Thuraya Studio" },
      { name: "description", content: "Send us a brief in minutes. Select a service, share your vision, upload references and get a proposal within 24h." },
    ],
  }),
  component: ProjectBuilder,
});

type FileEntry = { name: string; size: number; type: string; dataUrl: string };

function ProjectBuilder() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const svc = useMemo(() => services.find((s) => s.id === serviceId)!, [serviceId]);

  const handleFiles = async (list: FileList | null) => {
    if (!list) return;
    const entries: FileEntry[] = [];
    for (const f of Array.from(list).slice(0, 6)) {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB`);
        continue;
      }
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
      entries.push({ name: f.name, size: f.size, type: f.type, dataUrl });
    }
    setFiles((prev) => [...prev, ...entries].slice(0, 8));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business.trim() || !email.trim() || !description.trim()) {
      toast.error("Please fill in business, email and description.");
      return;
    }
    setSubmitting(true);
    const id = "TH-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const project = {
      id,
      service: svc.name,
      serviceId,
      business,
      email,
      description,
      budget: budget || priceRange(svc),
      files,
      createdAt: new Date().toISOString(),
      status: "Received",
      progress: 10,
      updates: [{ at: new Date().toISOString(), text: "Brief received. We'll reply within 24h." }],
    };
    try {
      const existing = JSON.parse(localStorage.getItem("thuraya.projects") || "[]");
      existing.unshift(project);
      localStorage.setItem("thuraya.projects", JSON.stringify(existing));
      localStorage.setItem("thuraya.lastEmail", email);
      toast.success(`Request submitted — reference ${id}`);
      setBusiness(""); setDescription(""); setBudget(""); setFiles([]);
    } catch {
      toast.error("Could not save locally.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-x py-20">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-secondary">Project Builder</div>
        <h1 className="mt-3 text-5xl md:text-6xl text-primary">Tell us about your project.</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Share a few details — we'll reply with a proposal and next steps within 24 hours.
        </p>
      </div>

      <form onSubmit={submit} className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-card p-6 md:p-10 ring-soft space-y-6">
          <Field label="Service">
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="input"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {priceRange(s)}</option>
              ))}
            </select>
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Business name">
              <input value={business} onChange={(e) => setBusiness(e.target.value)} className="input" placeholder="e.g. Layla Café" />
            </Field>
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@business.ae" />
            </Field>
          </div>

          <Field label="Describe your project">
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
              placeholder="What are you building, who is it for, and what feeling should it evoke?"
            />
          </Field>

          <Field label="Budget (AED)">
            <div className="flex flex-wrap gap-2">
              {["Under 150", "150 – 300", "300 – 500", "500+"].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`rounded-full px-4 py-2 text-sm border transition ${
                    budget === b ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  AED {b}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Reference files (optional)">
            <label className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-mist/60 p-6 cursor-pointer hover:border-secondary transition">
              <Upload className="h-5 w-5 text-secondary" />
              <div className="text-sm">
                <div className="text-foreground">Drop images or PDFs, or click to upload</div>
                <div className="text-xs text-muted-foreground">Max 5MB each, up to 8 files</div>
              </div>
              <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} accept="image/*,application/pdf" />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 grid gap-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs">
                    <span className="truncate">{f.name}</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-95 disabled:opacity-60"
          >
            <Send className="h-4 w-4" /> {submitting ? "Sending..." : "Submit request"}
          </button>
        </div>

        <aside className="rounded-3xl bg-primary text-primary-foreground p-8 h-fit ring-soft sticky top-24">
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent">Selected</div>
          <h3 className="mt-2 text-2xl font-display">{svc.name}</h3>
          <div className="mt-1 text-primary-foreground/70 text-sm">{svc.tagline}</div>
          <div className="mt-6 font-display text-3xl text-accent">{priceRange(svc)}</div>
          <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
            {svc.features.map((f) => <li key={f}>· {f}</li>)}
          </ul>
          <p className="mt-8 text-xs text-primary-foreground/60">
            After submitting, you'll get a reference code — track your project from the Dashboard.
          </p>
        </aside>
      </form>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: var(--color-foreground);
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-secondary) 15%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</div>
      {children}
    </label>
  );
}
