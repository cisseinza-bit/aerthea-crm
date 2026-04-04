import prisma from "@/lib/prisma";
import PhaseChecklist from "@/components/PhaseChecklist";
import AddPhaseButton from "@/components/AddPhaseButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { client: true, phases: { orderBy: { order: "asc" } } },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="p-8 min-h-screen bg-[#0A0A0A]">
      <div className="mb-8">
        <p className="text-[#D8FF57] text-xs font-mono tracking-widest uppercase">Aerthea CRM</p>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">Projets</h1>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#1A1A1A] border border-[#2A2A2A]">
            {/* Header */}
            <div className="p-6 border-b border-[#2A2A2A] flex items-start justify-between">
              <div>
                <h2 className="text-[#F5F5F5] font-bold text-lg">{project.title}</h2>
                <p className="text-[#888888] text-sm mt-0.5">{project.client.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#888888] text-sm">{project.budget} €</span>
                <Link
                  href={`/dossiers/${project.id}`}
                  className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] transition-colors"
                >
                  📁 Dossier
                </Link>
              </div>
            </div>

            {/* Phases checklist */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#888888] text-xs font-mono tracking-widest uppercase">Avancement</p>
                <AddPhaseButton projectId={project.id} />
              </div>
              <PhaseChecklist phases={project.phases} projectId={project.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
