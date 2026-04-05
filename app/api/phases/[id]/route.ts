import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();

  const phase = await prisma.phase.update({
    where: { id: params.id },
    data: {
      status,
      completedAt: status === "done" ? new Date() : null,
    },
    include: { project: { include: { client: true, phases: true } } },
  });

  if (status === "done") {
    const { project } = phase;
    const allPhases   = project.phases;
    const doneCount   = allPhases.filter(p => p.status === "done").length;
    const progress    = Math.round((doneCount / allPhases.length) * 100);

    // 1. Update project progress
    await prisma.project.update({
      where: { id: project.id },
      data:  { progress, status: progress === 100 ? "done" : "in_progress" },
    });

    // 2. ActivityLog
    await prisma.activityLog.create({
      data: {
        message:   `Phase "${phase.title}" terminée — ${project.title} — ${project.client.company}`,
        type:      "phase_done",
        agentName: "Studio",
      },
    });

    // 3. Notification
    await prisma.notification.create({
      data: {
        message:   `✅ ${phase.title} validé par Aerthea Studio`,
        type:      "phase_done",
        projectId: project.id,
      },
    });

    // 4. Si la phase contient "Audit" → trigger IRIS
    if (phase.title.toLowerCase().includes("audit")) {
      const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
      await fetch(`${baseUrl}/api/agents/iris/trigger`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          message: `L'audit ${project.title} est terminé. Envoie un email de confirmation à ${project.client.email}.`,
        }),
      }).catch(() => null); // non-bloquant
    }
  }

  return NextResponse.json({ ...phase, _toast: status === "done" ? `✅ "${phase.title}" marquée comme terminée` : `↩ "${phase.title}" réouverte` });
}
