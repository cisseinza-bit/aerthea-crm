import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const AGENT_COLORS: Record<string, string> = {
  ELODIE: "#A78BFA",
  ATLAS:  "#D8FF57",
  FELIX:  "#34D399",
  IRIS:   "#60A5FA",
  ZARA:   "#F472B6",
};

export default async function DashboardPage() {
  const [agents, clients, projects] = await Promise.all([
    prisma.agent.findMany({ include: { runs: { orderBy: { startedAt: "desc" }, take: 1 } }, orderBy: { name: "asc" } }),
    prisma.client.findMany({ include: { projects: true } }),
    prisma.project.findMany({ include: { client: true, phases: { orderBy: { order: "asc" } } }, orderBy: { startDate: "desc" } }),
  ]);

  const activeProjects = projects.filter((p) => p.status === "in_progress");
  const totalRevenue   = projects.reduce((sum, p) => sum + parseFloat(p.budget || "0"), 0);

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#0A0A0A]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#D8FF57] text-xs font-mono tracking-widest uppercase">Aerthea Studio</p>
          <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">Dashboard</h1>
        </div>
        <div className="text-right">
          <p className="text-[#888888] text-xs font-mono">{new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Clients actifs",   value: clients.filter(c => c.status === "active").length,    unit: "" },
          { label: "Projets en cours", value: activeProjects.length,                                 unit: "" },
          { label: "Agents dispo",     value: agents.filter(a => a.status === "idle").length,        unit: `/ ${agents.length}` },
          { label: "Budget total",     value: totalRevenue.toLocaleString("fr-FR"),                  unit: "€" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5">
            <p className="text-[#888888] text-xs uppercase tracking-widest">{s.label}</p>
            <p className="text-[#F5F5F5] text-3xl font-bold mt-2">
              {s.value}<span className="text-[#D8FF57] text-sm ml-1">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Agents */}
      <section>
        <p className="text-[#888888] text-xs font-mono tracking-widest uppercase mb-4">Agents</p>
        <div className="grid grid-cols-5 gap-3">
          {agents.map((agent) => {
            const color   = AGENT_COLORS[agent.name] ?? "#D8FF57";
            const lastRun = agent.runs[0];
            return (
              <div key={agent.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 hover:border-[#D8FF57] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold" style={{ color }}>{agent.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    agent.status === "running"
                      ? "bg-[#D8FF57]/20 text-[#D8FF57]"
                      : "bg-[#2A2A2A] text-[#888888]"
                  }`}>
                    {agent.status === "running" ? "● EN COURS" : "○ IDLE"}
                  </span>
                </div>
                <p className="text-[#F5F5F5] text-xs leading-relaxed">{agent.role}</p>
                <p className="text-[#444444] text-[10px] font-mono mt-2">{agent.script}</p>
                {lastRun && (
                  <p className="text-[#444444] text-[10px] mt-1">
                    Dernier run : {new Date(lastRun.startedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
                <button
                  className="mt-3 w-full text-[10px] font-mono uppercase tracking-widest py-1.5 border transition-colors"
                  style={{ borderColor: color, color }}
                >
                  → Lancer
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects */}
      <section>
        <p className="text-[#888888] text-xs font-mono tracking-widest uppercase mb-4">Projets en cours</p>
        <div className="space-y-3">
          {projects.map((project) => {
            const donePhases  = project.phases.filter(p => p.status === "done").length;
            const totalPhases = project.phases.length;
            const pct         = totalPhases > 0 ? Math.round((donePhases / totalPhases) * 100) : project.progress;
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="block bg-[#1A1A1A] border border-[#2A2A2A] p-5 hover:border-[#D8FF57] cursor-pointer transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[#F5F5F5] group-hover:text-[#D8FF57] font-semibold text-sm transition-colors">{project.title}</h3>
                    <p className="text-[#888888] text-xs mt-0.5">{project.client.company}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-mono px-2 py-0.5 ${
                      project.status === "in_progress"
                        ? "bg-[#D8FF57]/20 text-[#D8FF57]"
                        : "bg-[#2A2A2A] text-[#888888]"
                    }`}>
                      {project.status === "in_progress" ? "EN COURS" : "EN ATTENTE"}
                    </span>
                    <p className="text-[#888888] text-xs mt-1">{project.budget} €</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#2A2A2A] h-1">
                    <div className="h-1 bg-[#D8FF57] transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[#888888] text-xs font-mono w-8 text-right">{pct}%</span>
                </div>

                {/* Phases */}
                <div className="flex gap-2 mt-3">
                  {project.phases.map((phase) => (
                    <div key={phase.id} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        phase.status === "done"        ? "bg-[#D8FF57]" :
                        phase.status === "in_progress" ? "bg-[#60A5FA]" :
                        "bg-[#2A2A2A]"
                      }`} />
                      <span className="text-[10px] text-[#888888]">{phase.title}</span>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Clients */}
      <section>
        <p className="text-[#888888] text-xs font-mono tracking-widest uppercase mb-4">Clients</p>
        <div className="grid grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 hover:border-[#D8FF57] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#0A0A0A] text-xs font-bold" style={{ background: client.color }}>
                  {client.company[0]}
                </div>
                <div>
                  <p className="text-[#F5F5F5] text-sm font-semibold">{client.company}</p>
                  <p className="text-[#888888] text-xs">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 ${
                  client.status === "active" ? "bg-[#D8FF57]/20 text-[#D8FF57]" : "bg-[#2A2A2A] text-[#888888]"
                }`}>
                  {client.status.toUpperCase()}
                </span>
                <span className="text-[#888888] text-xs">{client.projects.length} projet{client.projects.length > 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
