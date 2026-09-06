import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "william-barbosa-admin-super-secret-key-2026-secure"
);

export const COOKIE_NAME = "admin_session";

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload) return null;

    // Verify user still exists in database and is ADMIN
    const db = await getDb();
    const user = db.prepare("SELECT id, name, email, role FROM admin_users WHERE id = ?").get(payload.id) as { id: string; name: string; email: string; role: string } | undefined;

    if (!user || user.role !== "ADMIN") {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function requireAdminApi(request?: NextRequest): Promise<{ user: SessionPayload } | NextResponse> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) {
    return NextResponse.json({ success: false, message: "Acesso não autorizado. Faça login como administrador." }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, message: "Sessão inválida ou expirada." }, { status: 401 });
  }

  const db = await getDb();
  const user = db.prepare("SELECT id, name, email, role FROM admin_users WHERE id = ?").get(payload.id) as { id: string; name: string; email: string; role: string } | undefined;

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Permissão insuficiente. Requer perfil de Administrador." }, { status: 403 });
  }

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
