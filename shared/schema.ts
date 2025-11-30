import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  googleId: varchar("google_id").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  chatCount: integer("chat_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversations = pgTable(
  "conversations",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messages: jsonb("messages").notNull().default(sql`'[]'`),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("IDX_conversation_user").on(table.userId)],
);

export const insertUserSchema = createInsertSchema(users).pick({
  googleId: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;

export function getTierFromChatCount(chatCount: number): { tier: string; label: string; color: string } {
  if (chatCount === 0) return { tier: "unranked", label: "Novato", color: "gray" };
  if (chatCount >= 1 && chatCount < 5) return { tier: "bronze", label: "Bronze", color: "#CD7F32" };
  if (chatCount >= 5 && chatCount < 10) return { tier: "silver", label: "Prata", color: "#C0C0C0" };
  if (chatCount >= 10 && chatCount < 25) return { tier: "gold", label: "Ouro", color: "#FFD700" };
  if (chatCount >= 25 && chatCount < 50) return { tier: "platinum", label: "Platina", color: "#E5E4E2" };
  return { tier: "diamond", label: "Diamante", color: "#B9F2FF" };
}
