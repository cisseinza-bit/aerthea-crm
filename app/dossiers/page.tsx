import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DossiersPage() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="p-8 min-h-screen bg-[#0A0A0A]">
      <div className="mb-8">
        <p className="text-[#D8FF57] text-xs font-mono tracking-widest uppercase">Aerthea CRM</p>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">Dossiers partagés</h1>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {projects.length === 0 && (
          <p className="text-[#888888] text-sm text-center py-20 font-mono">Aucun projet — créez-en un depuis la page Projets</p>
        )}
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dossiers/${project.id}`}
            className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 flex items-center justify-between hover:border-[#D8FF57] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="text-xl">📁</span>
              <div>
                <p className="text-[#F5F5F5] font-semibold text-sm group-hover:text-[#D8FF57] transition-colors">{project.title}</p>
                <p className="text-[#888888] text-xs mt-0.5">{project.client.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-mono px-2 py-0.5 ${
                project.status === "in_progress" ? "bg-[#D8FF57]/20 text-[#D8FF57]" :
                project.status === "done"        ? "bg-[#2A2A2A] text-[#888888]" :
                "bg-[#2A2A2A] text-[#888888]"
              }`}>
                {project.status === "in_progress" ? "EN COURS" : project.status === "done" ? "TERMINÉ" : "EN ATTENTE"}
              </span>
              <span className="text-[#888888] text-xs font-mono">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
