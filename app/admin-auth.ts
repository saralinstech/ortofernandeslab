import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../db";
import { adminSessions, staff } from "../db/schema";

export const MASTER_EMAIL = "saralinstech@gmail.com";
export const ADMIN_SESSION_COOKIE = "__Host-of_admin_session";

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

export async function getAdminAccess() {
  try {
    const jar = await cookies();
    const sessionId = jar.get(ADMIN_SESSION_COOKIE)?.value;
    if (!sessionId) return null;
    const db = getDb();
    const [row] = await db.select({ id: staff.id, email: staff.email, name: staff.name, role: staff.role, active: staff.active, mustChangePassword: staff.mustChangePassword }).from(adminSessions).innerJoin(staff, eq(adminSessions.staffId, staff.id)).where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date().toISOString()), eq(staff.active, true))).limit(1);
    return row ? { displayName: row.name, email: row.email, role: row.role as "master" | "collaborator", id: row.id, mustChangePassword: row.mustChangePassword } : null;
  } catch {
    return null;
  }
}
