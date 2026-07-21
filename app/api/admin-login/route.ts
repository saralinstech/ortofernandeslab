import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { adminSessions, staff } from "../../../db/schema";
import { INITIAL_MASTER_HASH, MASTER_EMAIL, MASTER_SESSION_TOKEN, verifyPassword } from "../../admin-auth";

export async function POST(request: Request) {
  try {
    const form = new URLSearchParams(await request.text());
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    let sessionId = "";
    let mustChangePassword = false;

    if (email === MASTER_EMAIL && await verifyPassword(password, INITIAL_MASTER_HASH)) {
      sessionId = MASTER_SESSION_TOKEN;
    } else {
      const db = getDb();
      const [user] = await db.select().from(staff).where(eq(staff.email, email)).limit(1);
      if (!user || !user.active || !await verifyPassword(password, user.passwordHash)) {
        return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
      }
      sessionId = crypto.randomUUID();
      mustChangePassword = user.mustChangePassword;
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
      await db.insert(adminSessions).values({ id: sessionId, staffId: user.id, expiresAt: expires.toISOString() });
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL(mustChangePassword ? "/admin/perfil" : "/admin", request.url).toString(),
        "Set-Cookie": `of_admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`,
      },
    });
  } catch {
    return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
  }
}
