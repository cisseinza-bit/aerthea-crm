import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const formData  = await req.formData();
  const file      = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "uploads", params.projectId);
  await mkdir(uploadDir, { recursive: true });

  const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await writeFile(path.join(uploadDir, safeName), buffer);

  const record = await prisma.sharedFile.create({
    data: {
      name:         safeName,
      originalName: file.name,
      size:         file.size,
      mimeType:     file.type,
      projectId:    params.projectId,
    },
  });

  // Auto message
  await prisma.dossierMessage.create({
    data: {
      content:   `📎 Fichier déposé : ${file.name}`,
      author:    "Studio",
      projectId: params.projectId,
      fileId:    record.id,
    },
  });

  return NextResponse.json(record);
}

export async function GET(_: NextRequest, { params }: { params: { projectId: string } }) {
  const files = await prisma.sharedFile.findMany({
    where:   { projectId: params.projectId },
    orderBy: { uploadedAt: "desc" },
  });
  return NextResponse.json(files);
}
