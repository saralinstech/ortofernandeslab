import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { adminSessions, staff } from "../../../db/schema";
import { getAdminAccess, hashPassword, verifyPassword } from "../../admin-auth";

const passwordIsStrong = (password: string) => password.length >= 12
  && /[a-z]/.test(password)
  && /[A-Z]/.test(password)
  && /\d/.test(password)
  && /[^A-Za-z0-9]/.test(password);

export async function POST(request: Request) {
  try {
    const access = await getAdminAccess();
    if (!access) return Response.json({ error: "Sua sessão expirou. Entre novamente." }, { status: 401 });
    if (access.id <= 0) return Response.json({ error: "Esta credencial não pode ser alterada por este perfil." }, { status: 400 });

    const body = await request.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmation = String(body.confirmation || "");
    if (newPassword !== confirmation) return Response.json({ error: "A confirmação não corresponde à nova senha." }, { status: 400 });
    if (!passwordIsStrong(newPassword)) return Response.json({ error: "Use ao menos 12 caracteres, com maiúscula, minúscula, número e símbolo." }, { status: 400 });

    const db = getDb();
    const [user] = await db.select().from(staff).where(eq(staff.id, access.id)).limit(1);
    if (!user || !user.active) return Response.json({ error: "Cadastro não encontrado ou inativo." }, { status: 404 });
    if (!await verifyPassword(currentPassword, user.passwordHash)) return Response.json({ error: "A senha atual ou temporária está incorreta." }, { status: 400 });
    if (await verifyPassword(newPassword, user.passwordHash)) return Response.json({ error: "A nova senha precisa ser diferente da senha atual." }, { status: 400 });

    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    await db.update(staff).set({ passwordHash: await hashPassword(newPassword), mustChangePassword: false, passwordChangedAt: new Date().toISOString() }).where(eq(staff.id, access.id));
    await db.delete(adminSessions).where(eq(adminSessions.staffId, access.id));
    await db.insert(adminSessions).values({ id: sessionId, staffId: access.id, expiresAt: expires.toISOString() });

    return Response.json({ ok: true }, {
      headers: { "Set-Cookie": `__Host-of_admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600` },
    });
  } catch {
    return Response.json({ error: "Não foi possível alterar a senha. Tente novamente." }, { status: 500 });
  }
}
