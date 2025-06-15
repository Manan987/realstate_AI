import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  initials: text("initials").notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull(),
  sqft: integer("sqft").notNull(),
  pricePerSqft: integer("price_per_sqft").notNull(),
  marketPosition: text("market_position").notNull(), // "Above Average", "Market Average", "Below Average"
  imageUrl: text("image_url"),
  status: text("status").notNull().default("active"), // "active", "sold", "pending"
  daysOnMarket: integer("days_on_market").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  avgPrice: integer("avg_price").notNull(),
  competitorAvgPrice: integer("competitor_avg_price").notNull(),
  activeListings: integer("active_listings").notNull(),
  daysOnMarket: integer("days_on_market").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamActivity = pgTable("team_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  relatedProperty: text("related_property"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "pdf", "excel", "word"
  sharedBy: integer("shared_by").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  pricePerSqft: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  createdAt: true,
});

export const insertTeamActivitySchema = createInsertSchema(teamActivity).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type InsertTeamActivity = z.infer<typeof insertTeamActivitySchema>;
export type TeamActivity = typeof teamActivity.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
