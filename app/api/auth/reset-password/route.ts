import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";

  if (currentPassword !== adminPassword) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Nouveau mot de passe trop court" }, { status: 400 });
  }

  // Met à jour le fichier .env
  const envPath = path.join(process.cwd(), ".env");
  try {
    let envContent = readFileSync(envPath, "utf-8");
    if (envContent.includes("ADMIN_PASSWORD=")) {
      envContent = envContent.replace(/ADMIN_PASSWORD=.*/, `ADMIN_PASSWORD="${newPassword}"`);
    } else {
      envContent += `\nADMIN_PASSWORD="${newPassword}"`;
    }
    writeFileSync(envPath, envContent, "utf-8");
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour le fichier .env" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
