import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload, MessageSquare, Trash2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Client Dashboard — Thuraya Studio" },
      { name: "description", content: "Track your project's progress, upload files and read updates from the Thuraya team." },
    ],
  }),
  component: Dashboard,
});

type FileEntry = { name: string; size: number; type: string; dataUrl: string };
type Update = { at: string; text: string };
type Project = {
  id: string;
  service: string;
  serviceId: string;
  business: string;
  email: string;
  description: string;
  budget: string;
  files: FileEntry[];
  createdAt: string;
  status: string;
  progress: number;
  updates: Update[];
};

function load(): Project[] {
  try { return JSON.parse(localStorage.getItem("thuraya.projects") || "[]"); }
  catch { return []; }
}
function save(list: Project[]) {
  localStorage.setItem("thuraya.projects", JSON.stringify(list));
}

function Dashboard() {
  const [email, setEmail] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem("thuraya.lastEmail");
    if (last) { setEmail(last); enter(last); }
  }, []);

  const enter = (e?: string) => {
    const value = (e ?? email).trim();
    if (!value) return toast.error("Enter your email");
    setSignedIn(true);
    setProjects(load().filter((p) => p.email.toLowerCase() === value.toLowerCase()));
    localStorage.setItem("thuraya.lastEmail", value);
  };

  const refresh = () => setProjects(load().filter((p) => p.email.toLowerCase() === email.toLowerCase()));

  const addFiles = async (id: string, list: FileList | null) => {
    if (!list) return;
    const entries: FileEntry[] = [];
    for (const f of Array.from(list).slice(0, 4)) {
      if (f.size > 5 * 1024 * 1024) continue;
      const dataUrl = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); });
      entries.push({ name: f.name, size: f.size, type: f.type, dataUrl });
    }
    const all = load();
    const idx = all.findIndex((p) => p.id === id);
    if (idx >= 0) {
      all[idx].files = [...all[idx].files, ...entries];
      all[idx].updates.unshift({ at: new Date().toISOString(), text: `You uploaded ${entries.length} file(s).` });
      save(all);
      refresh();
      toast.success("Files added");
    }
  };

  const remove = (id: string) => {
    const all = load().filter((p) => p.id !== id);
    save(all); refresh(); toast.success("Project removed");
  };

  if (!signedIn) {
    return (
      <div className="container-x py-24 max-w-md">
        <div className="text-xs uppercase tracking-[0.25em] text-secondary">Client Access</div>
        <h1 className="mt-3 text-4xl text-primary">Sign in to your dashboard</h1>
        <p className="mt-3 text-muted-foreground text-sm">Use the same email you submitted your brief with.</p>
        <div className="mt-8 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.ae" className="w-full rounded-xl border border-border bg-background px-4 py-3" />
          <button onClick={() => enter()} className="w-full rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-medium">Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-secondary">Dashboard</div>
          <h1 className="mt-2 text-4xl md:text-5xl text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>
        <button onClick={() => { setSignedIn(false); setProjects([]); }} className="text-sm text-muted-foreground hover:text-primary">
          Sign out
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-card p-10 ring-soft text-center">
          <p className="text-muted-foreground">No projects yet under this email.</p>
          <a href="/project-builder" className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm">Start a project</a>
        </div>
      ) : (
        <div className="mt-10 grid gap-6">
          {projects.map((p) => (
            <div key={p.id} className="rounded-3xl bg-card p-6 md:p-8 ring-soft">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">#{p.id}</div>
                  <h3 className="mt-1 text-2xl font-display text-primary">{p.business}</h3>
                  <div className="text-sm text-muted-foreground">{p.service} · {p.budget}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent/30 text-primary px-3 py-1 text-xs font-medium">{p.status}</span>
                  <button onClick={() => remove(p.id)} className="rounded-full border border-border p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-accent" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Brief</div>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{p.description}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Updates</div>
                  <ul className="space-y-2">
                    {p.updates.map((u, i) => (
                      <li key={i} className="text-sm rounded-lg bg-mist/60 border border-border p-3">
                        <div className="text-xs text-muted-foreground">{new Date(u.at).toLocaleString()}</div>
                        <div>{u.text}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Files</div>
                <div className="flex flex-wrap gap-2">
                  {p.files.map((f, i) => (
                    <a key={i} href={f.dataUrl} download={f.name} className="rounded-lg border border-border bg-background px-3 py-2 text-xs hover:bg-muted">
                      {f.name}
                    </a>
                  ))}
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs hover:bg-muted">
                    <Upload className="h-3 w-3" /> Upload
                    <input type="file" multiple className="hidden" onChange={(e) => addFiles(p.id, e.target.files)} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
