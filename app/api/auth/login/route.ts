import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = Buffer.from(`${adminPassword}:${Date.now()}`).toString("base64");

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 7, // 7 jours
    path:     "/",
  });

  return res;
}
