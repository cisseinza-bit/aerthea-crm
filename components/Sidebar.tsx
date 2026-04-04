"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

const NAV = [
  { href: "/",          label: "Dashboard",  icon: "◈" },
  { href: "/agents",    label: "Agents",     icon: "◉" },
  { href: "/clients",   label: "Clients",    icon: "◎" },
  { href: "/projects",  label: "Projets",    icon: "◫" },
  { href: "/dossiers",  label: "Dossiers",   icon: "📁" },
  { href: "/campaigns", label: "Campagnes",  icon: "◧" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 flex-shrink-0 bg-[#111111] border-r border-[#2A2A2A] flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#2A2A2A]">
        <span className="font-bold text-[#F5F5F5] text-sm tracking-widest uppercase">AERTHEA</span>
        <span className="text-[#D8FF57] text-xs font-bold tracking-widest uppercase ml-1.5">CRM</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                active
                  ? "bg-[#D8FF57] text-[#0A0A0A] font-semibold"
                  : "text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2A2A2A] flex items-center justify-between">
        <div>
          <p className="text-[#888888] text-xs">Aerthea Studio</p>
          <p className="text-[#444444] text-[10px] mt-0.5">contact@aerthea-studio.fr</p>
        </div>
        <NotificationBell />
      </div>
    </aside>
  );
}
