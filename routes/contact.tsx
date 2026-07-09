import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Instagram, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Thuraya Studio" },
      { name: "description", content: "Get in touch with Thuraya Studio in the UAE. Email ThurayaADS.inquiries@gmail.com." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return toast.error("Please complete the form");
    const body = encodeURIComponent(`${msg}\n\n— ${name}`);
    const subject = encodeURIComponent(`New inquiry from ${name}`);
    window.location.href = `mailto:ThurayaADS.inquiries@gmail.com?subject=${subject}&body=${body}`;
    toast.success("Opening your mail app…");
  };

  return (
    <div className="container-x py-20 grid gap-12 lg:grid-cols-2">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-secondary">Contact</div>
        <h1 className="mt-3 text-5xl md:text-6xl text-primary text-balance">Let's start a conversation.</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-md">
          Tell us about your business, your goals and your timeline. We reply within 24 hours.
        </p>
        <div className="mt-10 space-y-4 text-sm">
          <a href="mailto:ThurayaADS.inquiries@gmail.com" className="flex items-center gap-3 group">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Mail className="h-4 w-4" /></span>
            <span className="group-hover:text-secondary">ThurayaADS.inquiries@gmail.com</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><MapPin className="h-4 w-4" /></span>
            <span>United Arab Emirates</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Instagram className="h-4 w-4" /></span>
            <span>@thuraya.ads</span>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-3xl bg-card p-8 ring-soft space-y-5">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Message</label>
          <textarea rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 resize-none" />
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-95">
          <Send className="h-4 w-4" /> Send message
        </button>
      </form>
    </div>
  );
}
