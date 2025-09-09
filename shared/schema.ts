import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pizzaFlavors = pgTable("pizza_flavors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  prices: jsonb("prices").notNull(), // { grande: "35.00", media: "28.00", individual: "18.00" }
  category: text("category").notNull(), // 'salgadas', 'doces', 'entradas', 'bebidas'
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Extras table
export const extras = pgTable("extras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'salgadas' or 'doces'
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Dough types table
export const doughTypes = pgTable("dough_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'salgadas' or 'doces'
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryMethod: text("delivery_method").notNull(), // 'pickup' or 'delivery'
  address: jsonb("address"), // { cep, street, number, complement, neighborhood }
  paymentMethod: text("payment_method").notNull(),
  items: jsonb("items").notNull(), // Array of cart items
  subtotal: text("subtotal").notNull(),
  deliveryFee: text("delivery_fee").default("0"),
  total: text("total").notNull(),
  notes: text("notes"),
  status: text("status").default("pending"), // 'pending', 'confirmed', 'preparing', 'ready', 'delivered'
  createdAt: text("created_at").default(sql`now()::text`),
});

// Pizzeria settings table
export const pizzeriaSettings = pgTable("pizzeria_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull(), // 'business_hours', 'contact', 'address', 'delivery', 'branding', 'social', 'categories'
  data: jsonb("data").notNull(), // JSON with section-specific data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPizzaFlavorSchema = createInsertSchema(pizzaFlavors).omit({
  id: true,
});

export const insertExtraSchema = createInsertSchema(extras).omit({
  id: true,
  createdAt: true,
});

export const insertDoughTypeSchema = createInsertSchema(doughTypes).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertPizzeriaSettingSchema = createInsertSchema(pizzeriaSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PizzaFlavor = typeof pizzaFlavors.$inferSelect;
export type InsertPizzaFlavor = z.infer<typeof insertPizzaFlavorSchema>;
export type Extra = typeof extras.$inferSelect;
export type InsertExtra = z.infer<typeof insertExtraSchema>;
export type DoughType = typeof doughTypes.$inferSelect;
export type InsertDoughType = z.infer<typeof insertDoughTypeSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type PizzeriaSetting = typeof pizzeriaSettings.$inferSelect;
export type InsertPizzeriaSetting = z.infer<typeof insertPizzeriaSettingSchema>;

// Price schema for different sizes
export const pricesSchema = z.object({
  grande: z.string().optional(),
  media: z.string().optional(), 
  individual: z.string().optional(),
});

// Cart item type for frontend
export const cartItemSchema = z.object({
  id: z.string(),
  size: z.enum(["1", "2", "3"]), // Number of flavors
  type: z.enum(["grande", "media", "individual"]),
  category: z.enum(["salgadas", "doces", "bebidas", "entradas"]),
  slices: z.number(),
  flavors: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  })),
  doughType: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  }).optional(),
  extras: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  observations: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Address schema
export const addressSchema = z.object({
  cep: z.string().min(8).max(9),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
});

export type Address = z.infer<typeof addressSchema>;
