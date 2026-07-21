import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../db";
import { adminSessions, staff } from "../db/schema";

export const MASTER_EMAIL = "saralinstech@gmail.com";
export const INITIAL_MASTER_HASH = "2bce7c586ded9c9c0921b8ea66ac306b6a709866bec7f4bcb34cb4a0650a8afd";
export const MASTER_SESSION_TOKEN = "6db7bb634406c9ccb93165273828272cd46c1529d798547f2a74a7d161d0a03a";

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (value: string) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

export async function hashPassword(value: string) {
  const iterations = 210000;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(value), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(new Uint8Array(bits))}`;
}

export async function verifyPassword(value: string, stored: string) {
  if (!stored.startsWith("pbkdf2$")) return await sha256(value) === stored;
  const [, iterationValue, saltValue, hashValue] = stored.split("$");
  const iterations = Number(iterationValue);
  if (!iterations || !saltValue || !hashValue) return false;
  const salt = fromBase64(saltValue);
  const expected = fromBase64(hashValue);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(value), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, expected.length * 8));
  if (bits.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < bits.length; index++) difference |= bits[index] ^ expected[index];
  return difference === 0;
}

export async function ensureMaster() {
  const db = getDb();
  const [found] = await db.select().from(staff).where(eq(staff.email, MASTER_EMAIL)).limit(1);
  if (found) {
    if (!found.passwordHash) {
      const [updated] = await db.update(staff).set({ passwordHash: INITIAL_MASTER_HASH, role: "master", active: true }).where(eq(staff.id, found.id)).returning();
      return updated;
    }
    return found;
  }
  const [created] = await db.insert(staff).values({ email: MASTER_EMAIL, name: "Administrador Master", passwordHash: INITIAL_MASTER_HASH, role: "master" }).returning();
  return created;
}

export async function getAdminAccess() {
  try {
    const jar = await cookies();
    const sessionId = jar.get("of_admin_session")?.value;
    if (!sessionId) return null;
    if (sessionId === MASTER_SESSION_TOKEN) {
      return { displayName: "Administrador Master", email: MASTER_EMAIL, role: "master" as const, id: 0 };
    }
    const db = getDb();
    const [row] = await db.select({ id: staff.id, email: staff.email, name: staff.name, role: staff.role, active: staff.active }).from(adminSessions).innerJoin(staff, eq(adminSessions.staffId, staff.id)).where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date().toISOString()), eq(staff.active, true))).limit(1);
    return row ? { displayName: row.name, email: row.email, role: row.role as "master" | "collaborator", id: row.id } : null;
  } catch {
    return null;
  }
}
