import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const agents = await prisma.agent.findMany({
    include: { runs: { orderBy: { startedAt: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(agents);
}
