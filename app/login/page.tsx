"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Mot de passe incorrect.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-bold text-[#F5F5F5] text-lg tracking-widest uppercase">AERTHEA</span>
          <span className="text-[#D8FF57] text-sm font-bold tracking-widest uppercase ml-1.5">CRM</span>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-8">
          <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-6 text-center">Accès studio</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2.5 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={!password || loading}
              className="w-full py-2.5 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40"
            >
              {loading ? "…" : "Entrer"}
            </button>
          </form>
        </div>

        <p className="text-[#444444] text-[10px] font-mono text-center mt-4">
          Aerthea Studio · contact@aerthea-studio.fr
        </p>
      </div>
    </div>
  );
}
