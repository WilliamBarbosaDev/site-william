import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "E-mail e senha são obrigatórios." }, { status: 400 });
    }

    const db = await getDb();
    const user = db.prepare("SELECT id, name, email, password_hash, role FROM admin_users WHERE email = ?").get(email) as {
      id: string;
      name: string;
      email: string;
      password_hash: string;
      role: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas." }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas." }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Acesso restrito a administradores." }, { status: 403 });
    }

    // Update last login
    const now = new Date().toISOString();
    db.prepare("UPDATE admin_users SET last_login_at = ? WHERE id = ?").run(now, user.id);

    // Create session token
    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login realizado com sucesso.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Erro no login administrativo:", error);
    return NextResponse.json({ success: false, message: "Erro interno no servidor." }, { status: 500 });
  }
}
