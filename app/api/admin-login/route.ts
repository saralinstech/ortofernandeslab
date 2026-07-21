import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { adminSessions, staff } from "../../../db/schema";
import { ADMIN_SESSION_COOKIE, verifyPassword } from "../../admin-auth";

export async function POST(request: Request) {
  try {
    const form = new URLSearchParams(await request.text());
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    if (!email || email.length > 254 || password.length > 256) {
      return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
    }

    const db = getDb();
    const [user] = await db.select().from(staff).where(eq(staff.email, email)).limit(1);
    if (!user || !user.active || !user.passwordHash || !await verifyPassword(password, user.passwordHash)) {
      return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
    }

    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    await db.insert(adminSessions).values({ id: sessionId, staffId: user.id, expiresAt: expires.toISOString() });

    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL(user.mustChangePassword ? "/admin/perfil" : "/admin", request.url).toString(),
        "Set-Cookie": `${ADMIN_SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`,
      },
    });
  } catch {
    return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
  }
}
