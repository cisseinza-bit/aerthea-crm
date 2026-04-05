import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const notifs = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { project: { include: { client: true } } },
  });
  return NextResponse.json(notifs);
}

export async function PATCH() {
  await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
