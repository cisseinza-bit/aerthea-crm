import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { client: true, phases: { orderBy: { order: "asc" } } },
    orderBy: { startDate: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const { title, clientId, budget, status, phases } = await req.json();
  const project = await prisma.project.create({
    data: {
      title,
      clientId,
      budget: budget ?? "",
      status: status ?? "pending",
      phases: {
        create: (phases as string[]).map((title: string, i: number) => ({
          title,
          order: i + 1,
          status: "pending",
        })),
      },
    },
    include: { client: true, phases: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(project, { status: 201 });
}
