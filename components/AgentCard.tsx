"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Run = {
  id: string;
  status: string;
  input: string;
  output: string;
  startedAt: string;
};

type Agent = {
  id: string;
  name: string;
  role: string;
  script: string;
  status: string;
  lastRunAt: string | null;
  runs: Run[];
};

const AGENT_COLORS: Record<string, string> = {
  ELODIE: "#A78BFA",
  ATLAS:  "#D8FF57",
  FELIX:  "#34D399",
  IRIS:   "#60A5FA",
  ZARA:   "#F472B6",
};

const STATUS_BADGE: Record<string, string> = {
  running:   "bg-[#E8630A]/20 text-[#E8630A]",
  triggered: "bg-[#60A5FA]/20 text-[#60A5FA]",
  done:      "bg-[#D8FF57]/20 text-[#D8FF57]",
  error:     "bg-red-500/20 text-red-400",
};

export default function AgentCard({ agent }: { agent: Agent }) {
  const [open, setOpen]     = useState(false);
  const [brief, setBrief]   = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const color  = AGENT_COLORS[agent.name] ?? "#D8FF57";

  async function launch(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    await fetch(`/api/agents/${agent.name.toLowerCase()}/run`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ input: brief }),
    });
    setBrief("");
    setOpen(false);
    setSending(false);
    router.refresh();
  }

  const statusLabel =
    agent.status === "running" ? "● EN COURS" :
    agent.status === "done"    ? "✓ TERMINÉ"  : "○ IDLE";

  const statusClass =
    agent.status === "running" ? "bg-[#E8630A]/20 text-[#E8630A]" :
    agent.status === "done"    ? "bg-[#D8FF57]/20 text-[#D8FF57]" :
    "bg-[#2A2A2A] text-[#888888]";

  return (
    <>
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D8FF57] transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A0A0A] text-sm font-bold flex-shrink-0"
              style={{ background: color }}
            >
              {agent.name[0]}
            </div>
            <div>
              <p className="font-bold text-sm font-mono" style={{ color }}>{agent.name}</p>
              <p className="text-[#888888] text-xs mt-0.5">{agent.role}</p>
              <p className="text-[#444444] text-[10px] font-mono mt-0.5">{agent.script}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusClass}`}>
              {statusLabel}
            </span>
            {agent.lastRunAt && (
              <span className="text-[#444444] text-[10px] font-mono">
                {new Date(agent.lastRunAt).toLocaleDateString("fr-FR")}
              </span>
            )}
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-colors"
              style={{ borderColor: color, color }}
            >
              → Lancer
            </button>
          </div>
        </div>

        {/* Historique runs */}
        <div className="divide-y divide-[#2A2A2A]">
          {agent.runs.length === 0 && (
            <p className="text-[#444444] text-xs font-mono text-center py-4">Aucun run enregistré</p>
          )}
          {agent.runs.map(run => (
            <div key={run.id} className="flex items-start gap-3 px-6 py-3 hover:bg-[#111] transition-colors">
              <span className={`text-[10px] font-mono px-1.5 py-0.5 flex-shrink-0 mt-0.5 ${STATUS_BADGE[run.status] ?? "bg-[#2A2A2A] text-[#888888]"}`}>
                {run.status.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[#F5F5F5] text-xs">{run.input || "—"}</p>
                {run.output && (
                  <p className="text-[#888888] text-[10px] mt-0.5">{run.output}</p>
                )}
              </div>
              <span className="text-[#444444] text-[10px] font-mono flex-shrink-0">
                {new Date(run.startedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                {" · "}
                {new Date(run.startedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modale Brief */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
              <div>
                <span className="text-[#F5F5F5] text-sm font-semibold">Lancer </span>
                <span className="font-bold text-sm font-mono" style={{ color }}>{agent.name}</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#888888] hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={launch} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">
                  Brief
                </label>
                <textarea
                  autoFocus
                  value={brief}
                  onChange={e => setBrief(e.target.value)}
                  placeholder={`Décris la mission pour ${agent.name}…`}
                  rows={4}
                  className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57] resize-none"
                />
              </div>
              <p className="text-[#888888] text-[10px] font-mono">{agent.role}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 border border-[#2A2A2A] text-[#888888] text-sm hover:border-[#F5F5F5] hover:text-[#F5F5F5] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-2.5 text-[#0A0A0A] text-sm font-bold transition-colors disabled:opacity-40"
                  style={{ background: color }}
                >
                  {sending ? "…" : "→ Lancer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
