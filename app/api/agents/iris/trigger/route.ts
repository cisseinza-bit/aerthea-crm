import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Log the trigger in AgentRun
  const agent = await prisma.agent.findFirst({ where: { name: "IRIS" } });
  if (agent) {
    await prisma.agentRun.create({
      data: {
        agentId: agent.id,
        status:  "triggered",
        input:   message,
        output:  "En attente de validation manuelle par Inza",
      },
    });

    await prisma.agent.update({
      where: { id: agent.id },
      data:  { status: "idle", lastRunAt: new Date() },
    });
  }

  // Log activité
  await prisma.activityLog.create({
    data: {
      message:   `IRIS · Trigger audit reçu : ${message}`,
      type:      "agent_trigger",
      agentName: "IRIS",
    },
  });

  return NextResponse.json({ ok: true, message: "IRIS notifiée — email en attente de validation Inza" });
}
