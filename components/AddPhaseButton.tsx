"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPhaseButton({ projectId }: { projectId: string }) {
  const [open, setOpen]   = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    const res = await fetch("/api/phases", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ title: title.trim(), projectId }),
    });
    if (res.ok) {
      setTitle("");
      setOpen(false);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-5 h-5 flex items-center justify-center border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] transition-colors text-xs font-mono"
        title="Ajouter une phase"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
              <span className="text-[#F5F5F5] text-sm font-semibold">Nouvelle phase</span>
              <button onClick={() => setOpen(false)} className="text-[#888888] hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={submit} className="px-5 py-4 space-y-4">
              <div>
                <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">
                  Titre de la phase
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Révision finale"
                  className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 border border-[#2A2A2A] text-[#888888] text-sm hover:border-[#F5F5F5] hover:text-[#F5F5F5] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || saving}
                  className="flex-1 py-2 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40"
                >
                  {saving ? "…" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
