import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const clients = await prisma.client.findMany({
    include: { projects: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const { name, email, company, budget, status, color } = await req.json();
  if (!name?.trim() || !email?.trim() || !company?.trim()) {
    return NextResponse.json({ error: "name, email et company sont requis" }, { status: 400 });
  }
  const client = await prisma.client.create({
    data: { name, email, company, status: status ?? "prospect", color: color ?? "#E8630A" },
    include: { projects: true },
  });
  return NextResponse.json(client, { status: 201 });
}
