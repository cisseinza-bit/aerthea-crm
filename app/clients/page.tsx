"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Project = { id: string; title: string; status: string; budget: string };
type Client  = { id: string; name: string; email: string; company: string; color: string; status: string; projects: Project[] };

const STATUS_LABELS: Record<string, string> = { prospect: "PROSPECT", active: "ACTIF", done: "TERMINÉ" };
const STATUS_COLORS: Record<string, string> = {
  prospect: "bg-[#E8630A]/20 text-[#E8630A]",
  active:   "bg-[#D8FF57]/20 text-[#D8FF57]",
  done:     "bg-[#2A2A2A] text-[#888888]",
};

/* ── Modale Nouveau Client ── */
function NewClientModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Client) => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", status: "prospect", color: "#E8630A" });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { onCreated(await res.json()); onClose(); }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
          <span className="text-[#F5F5F5] text-sm font-semibold">Nouveau client</span>
          <button onClick={onClose} className="text-[#888888] hover:text-white text-sm">✕</button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <Field label="Nom" value={form.name}    onChange={v => set("name", v)}    placeholder="Prénom Nom" />
          <Field label="Email" value={form.email}  onChange={v => set("email", v)}   placeholder="contact@exemple.fr" type="email" />
          <Field label="Société" value={form.company} onChange={v => set("company", v)} placeholder="Nom de la société" />
          <Field label="Budget signé (€)" value={form.budget} onChange={v => set("budget", v)} placeholder="0" type="number" />
          <div>
            <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Statut</label>
            <select
              value={form.status}
              onChange={e => set("status", e.target.value)}
              className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2 focus:outline-none focus:border-[#D8FF57]"
            >
              <option value="prospect">Prospect</option>
              <option value="active">Actif</option>
              <option value="done">Terminé</option>
            </select>
          </div>
          <div>
            <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Couleur</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color}
                onChange={e => set("color", e.target.value)}
                className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded"
              />
              <span className="text-[#888888] text-xs font-mono">{form.color}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#2A2A2A] text-[#888888] text-sm hover:border-[#F5F5F5] hover:text-[#F5F5F5] transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving || !form.name || !form.email || !form.company}
              className="flex-1 py-2.5 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40">
              {saving ? "…" : "Créer le client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modale Nouveau Projet ── */
function NewProjectModal({ client, onClose, onCreated }: { client: Client; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle]   = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("pending");
  const [phases, setPhases] = useState(["Brief & Cadrage", "Production", "Livraison"]);
  const [newPhase, setNewPhase] = useState("");
  const [saving, setSaving] = useState(false);

  function addPhase() {
    const t = newPhase.trim();
    if (!t) return;
    setPhases(p => [...p, t]);
    setNewPhase("");
  }

  function removePhase(i: number) { setPhases(p => p.filter((_, idx) => idx !== i)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || phases.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, clientId: client.id, budget, status, phases }),
      });
      if (res.ok) { onCreated(); onClose(); }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
          <div>
            <span className="text-[#F5F5F5] text-sm font-semibold">Nouveau projet</span>
            <span className="text-[#888888] text-xs ml-2 font-mono">· {client.company}</span>
          </div>
          <button onClick={onClose} className="text-[#888888] hover:text-white text-sm">✕</button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <Field label="Titre du projet" value={title} onChange={setTitle} placeholder="Ex: Campagne Automne 2026" />
          <Field label="Budget (€)" value={budget} onChange={setBudget} placeholder="0" type="number" />
          <div>
            <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Statut initial</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2 focus:outline-none focus:border-[#D8FF57]"
            >
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
            </select>
          </div>

          {/* Phases */}
          <div>
            <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-2">Phases du projet</label>
            <div className="space-y-1.5 mb-2">
              {phases.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#111] border border-[#2A2A2A] px-3 py-2">
                  <span className="text-[#888888] text-xs font-mono w-5">{i + 1}.</span>
                  <span className="text-[#F5F5F5] text-sm flex-1">{p}</span>
                  <button type="button" onClick={() => removePhase(i)} className="text-[#444444] hover:text-[#888888] text-xs ml-2">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newPhase}
                onChange={e => setNewPhase(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addPhase(); } }}
                placeholder="Ajouter une phase…"
                className="flex-1 bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
              />
              <button type="button" onClick={addPhase}
                className="px-3 py-2 border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] text-sm transition-colors">
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#2A2A2A] text-[#888888] text-sm hover:border-[#F5F5F5] hover:text-[#F5F5F5] transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving || !title || phases.length === 0}
              className="flex-1 py-2.5 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40">
              {saving ? "…" : "Créer le projet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Champ réutilisable ── */
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
      />
    </div>
  );
}

/* ── Page principale ── */
export default function ClientsPage() {
  const [clients, setClients]         = useState<Client[]>([]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [projectTarget, setProjectTarget] = useState<Client | null>(null);

  async function load() {
    const res = await fetch("/api/clients");
    if (res.ok) setClients(await res.json());
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#D8FF57] text-xs font-mono tracking-widest uppercase">Aerthea CRM</p>
          <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">Clients</h1>
        </div>
        <button
          onClick={() => setShowNewClient(true)}
          className="px-4 py-2.5 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors"
        >
          + Nouveau client
        </button>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {clients.length === 0 && (
          <p className="text-[#888888] text-sm text-center py-20 font-mono">Aucun client — créez le premier</p>
        )}
        {clients.map(client => (
          <div key={client.id} className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D8FF57] transition-colors">
            {/* Client header */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: client.color }}>
                  {client.company[0]}
                </div>
                <div>
                  <p className="text-[#F5F5F5] font-semibold">{client.company}</p>
                  <p className="text-[#888888] text-xs mt-0.5">{client.name} · {client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono px-2 py-0.5 ${STATUS_COLORS[client.status] ?? "bg-[#2A2A2A] text-[#888888]"}`}>
                  {STATUS_LABELS[client.status] ?? client.status.toUpperCase()}
                </span>
                <button
                  onClick={() => setProjectTarget(client)}
                  className="px-3 py-1.5 border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  + Projet
                </button>
              </div>
            </div>

            {/* Projets du client */}
            {client.projects.length > 0 && (
              <div className="border-t border-[#2A2A2A] px-5 py-3 flex flex-wrap gap-2">
                {client.projects.map(p => (
                  <Link
                    key={p.id}
                    href={`/dossiers/${p.id}`}
                    className="flex items-center gap-2 bg-[#111] border border-[#2A2A2A] px-3 py-1.5 hover:border-[#D8FF57] transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.status === "in_progress" ? "bg-[#D8FF57]" : "bg-[#2A2A2A]"}`} />
                    <span className="text-[#888888] text-xs">{p.title}</span>
                    {p.budget && <span className="text-[#444444] text-[10px] font-mono">{p.budget} €</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modales */}
      {showNewClient && (
        <NewClientModal
          onClose={() => setShowNewClient(false)}
          onCreated={c => setClients(prev => [c, ...prev])}
        />
      )}
      {projectTarget && (
        <NewProjectModal
          client={projectTarget}
          onClose={() => setProjectTarget(null)}
          onCreated={() => { load(); setProjectTarget(null); }}
        />
      )}
    </div>
  );
}
