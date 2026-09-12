import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow();

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  clinic: text("clinic"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  cro: text("cro"),
  createdAt: createdAt(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  clinic: text("clinic"),
  phone: text("phone").notNull(),
  email: text("email"),
  cro: text("cro"),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name"),
  phone: text("phone"),
  items: text("items").notNull(),
  total: doublePrecision("total").notNull(),
  discount: doublePrecision("discount").notNull().default(0),
  status: text("status").notNull().default("Aguardando confirmação"),
  source: text("source").notNull().default("catalog"),
  createdBy: text("created_by"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  createdAt: createdAt(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  publicVisible: boolean("public_visible").notNull().default(true),
  active: boolean("active").notNull().default(true),
}, (table) => [uniqueIndex("products_name_unique_active").on(table.name).where(sql`active`)]);

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""),
  mustChangePassword: boolean("must_change_password").notNull().default(true),
  passwordChangedAt: timestamp("password_changed_at", { withTimezone: true, mode: "string" }),
  role: text("role").notNull().default("collaborator"),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
}, (table) => [uniqueIndex("staff_email_unique").on(sql`lower(${table.email})`)]);

export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  staffId: integer("staff_id").notNull().references(() => staff.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
  createdAt: createdAt(),
});

export const orderEvents = pgTable("order_events", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  status: text("status"),
  content: text("content"),
  createdBy: text("created_by"),
  createdAt: createdAt(),
});
