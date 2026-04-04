import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { projectId: string } }) {
  const messages = await prisma.dossierMessage.findMany({
    where:   { projectId: params.projectId },
    orderBy: { createdAt: "asc" },
    include: { file: true },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const { content, author } = await req.json();
  const msg = await prisma.dossierMessage.create({
    data: { content, author: author ?? "Studio", projectId: params.projectId },
    include: { file: true },
  });
  return NextResponse.json(msg);
}
