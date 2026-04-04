import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { name: string } }) {
  const { input } = await req.json();
  const agentName = params.name.toUpperCase();

  const agent = await prisma.agent.findFirst({ where: { name: agentName } });
  if (!agent) return NextResponse.json({ error: "Agent introuvable" }, { status: 404 });

  const run = await prisma.agentRun.create({
    data: {
      agentId: agent.id,
      status:  "running",
      input:   input?.trim() ?? "",
      output:  "",
    },
  });

  await prisma.agent.update({
    where: { id: agent.id },
    data:  { status: "running", lastRunAt: new Date() },
  });

  await prisma.activityLog.create({
    data: {
      message:   `Agent ${agentName} lancé — Brief : ${input?.slice(0, 80) ?? "—"}`,
      type:      "agent_run",
      agentName,
    },
  });

  return NextResponse.json(run, { status: 201 });
}
