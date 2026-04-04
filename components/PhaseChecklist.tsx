"use client";
import { useState, useEffect } from "react";

type Phase = {
  id: string;
  title: string;
  status: string;
  order: number;
  notes: string;
};

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] border border-[#D8FF57] px-4 py-3 text-[#D8FF57] text-sm font-mono shadow-2xl animate-fade-in">
      {message}
    </div>
  );
}

export default function PhaseChecklist({ phases, projectId }: { phases: Phase[]; projectId: string }) {
  const [list, setList]     = useState(phases);
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast]   = useState<string | null>(null);

  async function toggle(phase: Phase) {
    if (loading) return;
    const newStatus = phase.status === "done" ? "pending" : "done";
    setLoading(phase.id);

    const res = await fetch(`/api/phases/${phase.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const data = await res.json();
      setList(prev => prev.map(p => p.id === phase.id ? { ...p, status: newStatus } : p));
      if (data._toast) setToast(data._toast);
    }
    setLoading(null);
  }

  const done  = list.filter(p => p.status === "done").length;
  const total = list.length;
  const pct   = Math.round((done / total) * 100);

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-[#2A2A2A] h-1">
          <div className="h-1 bg-[#D8FF57] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[#D8FF57] text-xs font-mono">{done}/{total}</span>
      </div>

      {/* Phases */}
      <div className="space-y-2">
        {list.map((phase) => {
          const isDone    = phase.status === "done";
          const isLoading = loading === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => toggle(phase)}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#2A2A2A] hover:border-[#D8FF57] transition-colors text-left group"
            >
              <span className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors ${
                isDone
                  ? "bg-[#D8FF57] border-[#D8FF57]"
                  : "border-[#2A2A2A] group-hover:border-[#D8FF57]"
              }`}>
                {isDone && <span className="text-[#0A0A0A] text-xs font-bold">✓</span>}
                {isLoading && <span className="text-[#888888] text-xs">…</span>}
              </span>

              <span className={`text-sm flex-1 ${isDone ? "text-[#888888] line-through" : "text-[#F5F5F5]"}`}>
                {phase.title}
              </span>

              {isDone && <span className="text-[#D8FF57] text-[10px] font-mono">DONE</span>}
            </button>
          );
        })}
      </div>

      {pct === 100 && (
        <div className="mt-4 p-3 bg-[#D8FF57]/10 border border-[#D8FF57] text-[#D8FF57] text-xs font-mono text-center">
          ✅ Projet terminé — Notification envoyée au client
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
