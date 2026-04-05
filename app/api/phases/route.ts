import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { title, projectId } = await req.json();
  if (!title?.trim() || !projectId) {
    return NextResponse.json({ error: "title et projectId requis" }, { status: 400 });
  }

  const existing = await prisma.phase.count({ where: { projectId } });

  const phase = await prisma.phase.create({
    data: {
      title:     title.trim(),
      projectId,
      order:     existing + 1,
      status:    "pending",
    },
  });

  return NextResponse.json(phase, { status: 201 });
}
