import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { adminSessions, staff } from "../../../db/schema";
import { hashPassword, INITIAL_MASTER_HASH, MASTER_EMAIL, MASTER_SESSION_TOKEN } from "../../admin-auth";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    let sessionId = "";

    if (email === MASTER_EMAIL && await hashPassword(password) === INITIAL_MASTER_HASH) {
      sessionId = MASTER_SESSION_TOKEN;
    } else {
      const db = getDb();
      const [user] = await db.select().from(staff).where(eq(staff.email, email)).limit(1);
      if (!user || !user.active || user.passwordHash !== await hashPassword(password)) {
        return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
      }
      sessionId = crypto.randomUUID();
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
      await db.insert(adminSessions).values({ id: sessionId, staffId: user.id, expiresAt: expires.toISOString() });
    }

    const response = Response.redirect(new URL("/admin", request.url), 303);
    response.headers.append("Set-Cookie", `of_admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`);
    return response;
  } catch {
    return Response.redirect(new URL("/admin/login?erro=1", request.url), 303);
  }
}
