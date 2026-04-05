"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type View = "login" | "forgot" | "reset";

export default function LoginPage() {
  const [view, setView]         = useState<View>("login");
  const [password, setPassword] = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      if (res.ok) { router.push("/"); }
      else { setError("Mot de passe incorrect."); }
    } finally { setLoading(false); }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPass.length < 6) { setError("Mot de passe trop court (6 caractères min)."); return; }
    if (newPass !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      if (res.ok) {
        setSuccess("Mot de passe modifié. Tu peux te connecter.");
        setCurrentPass(""); setNewPass(""); setConfirm("");
        setTimeout(() => setView("login"), 2000);
      } else {
        const data = await res.json();
        setError(data.error ?? "Erreur lors du changement.");
      }
    } finally { setLoading(false); }
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

          {/* ── VUE LOGIN ── */}
          {view === "login" && (
            <>
              <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-6 text-center">Accès studio</p>
              <form onSubmit={submitLogin} className="space-y-4">
                <div>
                  <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Mot de passe</label>
                  <input
                    type="password" autoFocus
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2.5 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
                <button type="submit" disabled={!password || loading}
                  className="w-full py-2.5 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40">
                  {loading ? "…" : "Entrer"}
                </button>
              </form>
              <button onClick={() => { setError(""); setView("forgot"); }}
                className="w-full mt-4 text-[#888888] text-xs font-mono hover:text-[#F5F5F5] transition-colors text-center">
                Mot de passe oublié ?
              </button>
            </>
          )}

          {/* ── VUE MOT DE PASSE OUBLIÉ ── */}
          {view === "forgot" && (
            <>
              <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-2 text-center">Mot de passe oublié</p>
              <p className="text-[#444444] text-[10px] font-mono text-center mb-6 leading-relaxed">
                Pour réinitialiser ton mot de passe,<br/>
                connecte-toi au serveur et modifie<br/>
                la variable <span className="text-[#D8FF57]">ADMIN_PASSWORD</span> dans le fichier <span className="text-[#D8FF57]">.env</span>
              </p>
              <div className="bg-[#111] border border-[#2A2A2A] p-3 mb-4">
                <p className="text-[#888888] text-[10px] font-mono mb-1">Sur le serveur :</p>
                <code className="text-[#D8FF57] text-[10px] font-mono">nano /var/www/aerthea-crm/.env</code>
              </div>
              <p className="text-[#888888] text-[10px] font-mono text-center mb-4">— ou —</p>
              <button onClick={() => { setError(""); setView("reset"); }}
                className="w-full py-2.5 border border-[#D8FF57] text-[#D8FF57] text-sm font-mono hover:bg-[#D8FF57] hover:text-[#0A0A0A] transition-colors">
                Je connais mon mot de passe actuel →
              </button>
              <button onClick={() => { setError(""); setView("login"); }}
                className="w-full mt-3 text-[#888888] text-xs font-mono hover:text-[#F5F5F5] transition-colors text-center">
                ← Retour
              </button>
            </>
          )}

          {/* ── VUE CHANGER MOT DE PASSE ── */}
          {view === "reset" && (
            <>
              <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-6 text-center">Changer le mot de passe</p>
              <form onSubmit={submitReset} className="space-y-4">
                <div>
                  <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Mot de passe actuel</label>
                  <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2.5 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Nouveau mot de passe</label>
                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2.5 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] text-xs uppercase tracking-widest font-mono block mb-1.5">Confirmer</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111] border border-[#2A2A2A] text-[#F5F5F5] text-sm px-3 py-2.5 placeholder:text-[#444444] focus:outline-none focus:border-[#D8FF57]"
                  />
                </div>
                {error   && <p className="text-red-400 text-xs font-mono">{error}</p>}
                {success && <p className="text-[#D8FF57] text-xs font-mono">{success}</p>}
                <button type="submit" disabled={!currentPass || !newPass || !confirm || loading}
                  className="w-full py-2.5 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40">
                  {loading ? "…" : "Enregistrer"}
                </button>
              </form>
              <button onClick={() => { setError(""); setSuccess(""); setView("login"); }}
                className="w-full mt-3 text-[#888888] text-xs font-mono hover:text-[#F5F5F5] transition-colors text-center">
                ← Retour
              </button>
            </>
          )}
        </div>

        <p className="text-[#444444] text-[10px] font-mono text-center mt-4">
          Aerthea Studio · contact@aerthea-studio.fr
        </p>
      </div>
    </div>
  );
}
