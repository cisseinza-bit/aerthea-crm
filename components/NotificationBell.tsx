"use client";
import { useState, useEffect } from "react";

type Notif = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  project: { title: string; client: { company: string } };
};

export default function NotificationBell() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [open, setOpen]     = useState(false);

  async function load() {
    const res = await fetch("/api/notifications");
    if (res.ok) setNotifs(await res.json());
  }

  async function markRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (open) markRead();
  }, [open]);

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-8 h-8 flex items-center justify-center text-[#888888] hover:text-[#F5F5F5] transition-colors"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D8FF57] text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-80 bg-[#1A1A1A] border border-[#2A2A2A] shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-[#F5F5F5] text-xs font-mono uppercase tracking-widest">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-[#888888] text-xs hover:text-white">✕</button>
          </div>
          {notifs.length === 0 && (
            <p className="text-[#888888] text-xs text-center py-6">Aucune notification</p>
          )}
          {notifs.map(n => (
            <div key={n.id} className={`px-4 py-3 border-b border-[#2A2A2A] ${n.read ? "opacity-50" : ""}`}>
              <p className="text-[#F5F5F5] text-xs leading-relaxed">{n.message}</p>
              <p className="text-[#888888] text-[10px] mt-1">{n.project.client.company} · {new Date(n.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
