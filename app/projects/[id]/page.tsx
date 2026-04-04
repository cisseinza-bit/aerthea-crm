import prisma from "@/lib/prisma";
import PhaseChecklist from "@/components/PhaseChecklist";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      phases: { orderBy: { order: "asc" } },
      notifications: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!project) notFound();

  const done  = project.phases.filter(p => p.status === "done").length;
  const total = project.phases.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="p-8 min-h-screen bg-[#0A0A0A]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-6">
        <Link href="/" className="hover:text-[#F5F5F5] transition-colors">Dashboard</Link>
        <span>·</span>
        <Link href="/projects" className="hover:text-[#F5F5F5] transition-colors">Projets</Link>
        <span>·</span>
        <span className="text-[#F5F5F5]">{project.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#888888] text-xs font-mono">{project.client.company}</p>
          <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">{project.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono px-2 py-0.5 ${
            project.status === "in_progress" ? "bg-[#D8FF57]/20 text-[#D8FF57]" :
            project.status === "done"        ? "bg-[#2A2A2A] text-[#888888]" :
            "bg-[#2A2A2A] text-[#888888]"
          }`}>
            {project.status === "in_progress" ? "EN COURS" : project.status === "done" ? "TERMINÉ" : "EN ATTENTE"}
          </span>
          {project.budget && <span className="text-[#888888] text-sm">{project.budget} €</span>}
          <Link
            href={`/dossiers/${project.id}`}
            className="px-3 py-1.5 border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] text-xs font-mono uppercase tracking-widest transition-colors"
          >
            📁 Dossier
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Phases — 2/3 */}
        <div className="col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] p-6">
          <p className="text-[#888888] text-xs font-mono tracking-widest uppercase mb-4">Avancement · {pct}%</p>
          <PhaseChecklist phases={project.phases} projectId={project.id} />
        </div>

        {/* Sidebar info — 1/3 */}
        <div className="space-y-4">
          {/* Client */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5">
            <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-3">Client</p>
            <p className="text-[#F5F5F5] text-sm font-semibold">{project.client.company}</p>
            <p className="text-[#888888] text-xs mt-1">{project.client.name}</p>
            <p className="text-[#888888] text-xs">{project.client.email}</p>
          </div>

          {/* Stats */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5">
            <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-3">Résumé</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#888888] text-xs">Phases terminées</span>
                <span className="text-[#D8FF57] text-xs font-mono">{done} / {total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888] text-xs">Budget</span>
                <span className="text-[#F5F5F5] text-xs font-mono">{project.budget || "—"} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888] text-xs">Démarré le</span>
                <span className="text-[#F5F5F5] text-xs font-mono">
                  {new Date(project.startDate).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications récentes */}
          {project.notifications.length > 0 && (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5">
              <p className="text-[#888888] text-xs font-mono uppercase tracking-widest mb-3">Activité récente</p>
              <div className="space-y-2">
                {project.notifications.map(n => (
                  <div key={n.id} className={`text-xs ${n.read ? "text-[#444444]" : "text-[#888888]"}`}>
                    <p>{n.message}</p>
                    <p className="text-[10px] text-[#444444] mt-0.5 font-mono">
                      {new Date(n.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
