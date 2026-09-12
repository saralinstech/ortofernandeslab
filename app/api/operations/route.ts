import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { adminSessions, clients, orderEvents, orders, staff } from "../../../db/schema";
import { getAdminAccess, hashPassword } from "../../admin-auth";

async function auth() {
  const access = await getAdminAccess();
  if (!access) throw new Error("UNAUTHORIZED");
  if (access.mustChangePassword) throw new Error("PASSWORD_CHANGE_REQUIRED");
  return access;
}

export async function GET() {
  try {
    const access = await auth();
    const db = getDb();
    const [orderRows, clientRows, eventRows, staffRows, staffNames] = await Promise.all([
      db.select().from(orders).orderBy(desc(orders.id)).limit(200),
      db.select().from(clients).orderBy(desc(clients.id)),
      db.select().from(orderEvents).orderBy(desc(orderEvents.id)).limit(1000),
      access.role === "master" ? db.select({ id: staff.id, email: staff.email, name: staff.name, role: staff.role, active: staff.active, mustChangePassword: staff.mustChangePassword, createdAt: staff.createdAt }).from(staff).orderBy(desc(staff.id)) : Promise.resolve([]),
      db.select({ email: staff.email, name: staff.name }).from(staff),
    ]);
    const nameByEmail = new Map(staffNames.map((person) => [person.email.toLowerCase(), person.name]));
    const resolveCreatedBy = (createdBy: string | null) => (createdBy ? nameByEmail.get(createdBy.toLowerCase()) || createdBy : createdBy);
    return Response.json({
      role: access.role,
      orders: orderRows.map((order) => ({ ...order, total: access.role === "master" ? order.total : null, createdBy: resolveCreatedBy(order.createdBy) })),
      clients: clientRows,
      events: eventRows.map((event) => ({ ...event, createdBy: resolveCreatedBy(event.createdBy) })),
      staff: staffRows,
    });
  } catch {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await auth();
    const body = await request.json();
    const db = getDb();
    if (body.type === "client") {
      const [row] = await db.insert(clients).values({ name: String(body.name), clinic: String(body.clinic || ""), phone: String(body.phone), email: String(body.email || ""), cro: String(body.cro || ""), notes: String(body.notes || "") }).returning();
      return Response.json({ client: row }, { status: 201 });
    }
    if (body.type === "staff" && access.role === "master") {
      const password = String(body.password || "");
      if (password.length < 12) return Response.json({ error: "A senha precisa ter pelo menos 12 caracteres" }, { status: 400 });
      const [row] = await db.insert(staff).values({ email: String(body.email).trim().toLowerCase(), name: String(body.name), passwordHash: await hashPassword(password), mustChangePassword: true, role: String(body.role || "collaborator") }).returning();
      return Response.json({ staff: { id: row.id, email: row.email, name: row.name, role: row.role, active: row.active } }, { status: 201 });
    }
    if (body.type === "order") {
      const [row] = await db.insert(orders).values({ customerName: String(body.customerName || "Pedido administrativo"), phone: String(body.phone || ""), items: JSON.stringify(body.items || []), total: Number(body.total || 0), discount: Number(body.discount || 0), status: "Confirmado", source: "admin", createdBy: access.email, clientId: body.clientId ? Number(body.clientId) : null, notes: String(body.notes || "") }).returning();
      await db.insert(orderEvents).values({ orderId: row.id, type: "status", status: "Confirmado", content: "Pedido lançado pelo administrativo", createdBy: access.email });
      return Response.json({ order: row }, { status: 201 });
    }
    if (body.type === "order-comment") {
      const content = String(body.content || "").trim();
      if (!content) return Response.json({ error: "Escreva um comentário" }, { status: 400 });
      const [event] = await db.insert(orderEvents).values({ orderId: Number(body.orderId), type: "comment", content, createdBy: access.email }).returning();
      return Response.json({ event }, { status: 201 });
    }
    return Response.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Erro" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await auth();
    const body = await request.json();
    const db = getDb();
    if (body.type === "order") {
      const id = Number(body.id);
      const [current] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!current) return Response.json({ error: "Pedido não encontrado" }, { status: 404 });
      const hasItems = Array.isArray(body.items);
      const [row] = await db.update(orders).set({
        status: body.status !== undefined ? String(body.status) : current.status,
        customerName: body.customerName !== undefined ? String(body.customerName) : current.customerName,
        phone: body.phone !== undefined ? String(body.phone) : current.phone,
        clientId: body.clientId ? Number(body.clientId) : null,
        notes: body.notes !== undefined ? String(body.notes) : current.notes,
        items: hasItems ? JSON.stringify(body.items) : current.items,
        total: body.total !== undefined ? Number(body.total) : current.total,
        discount: body.discount !== undefined ? Number(body.discount) : current.discount,
        updatedAt: new Date().toISOString(),
      }).where(eq(orders.id, id)).returning();
      if (row.status !== current.status) await db.insert(orderEvents).values({ orderId: id, type: "status", status: row.status, content: `Status alterado de ${current.status} para ${row.status}`, createdBy: access.email });
      else if (body.recordEdit) await db.insert(orderEvents).values({ orderId: id, type: "edit", content: "Dados do pedido atualizados", createdBy: access.email });
      return Response.json({ order: row });
    }
    if (body.type === "staff-password" && access.role === "master") {
      const password = String(body.password || "");
      if (password.length < 12) return Response.json({ error: "A senha precisa ter pelo menos 12 caracteres" }, { status: 400 });
      const [row] = await db.update(staff).set({ passwordHash: await hashPassword(password), mustChangePassword: true, passwordChangedAt: null }).where(eq(staff.id, Number(body.id))).returning();
      await db.delete(adminSessions).where(eq(adminSessions.staffId, Number(body.id)));
      return Response.json({ staff: { id: row.id, email: row.email, name: row.name, role: row.role, active: row.active } });
    }
    return Response.json({ error: "Ação inválida" }, { status: 400 });
  } catch {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }
}
