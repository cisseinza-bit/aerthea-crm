import prisma from "@/lib/prisma";
import AgentCard from "@/components/AgentCard";


export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    include: { runs: { orderBy: { startedAt: "desc" }, take: 5 } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 min-h-screen bg-[#0A0A0A]">
      <div className="mb-8">
        <p className="text-[#D8FF57] text-xs font-mono tracking-widest uppercase">Aerthea CRM</p>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mt-1">Agents</h1>
      </div>

      <div className="space-y-4">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent as any} />
        ))}
      </div>
    </div>
  );
}
