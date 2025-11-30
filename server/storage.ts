import { users, conversations, type User, type UpsertUser, type Conversation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  upsertUserByGoogleId(user: UpsertUser): Promise<User>;
  incrementChatCount(userId: string): Promise<User | undefined>;
  saveMessage(userId: string, message: any): Promise<Conversation | undefined>;
  getUserConversations(userId: string): Promise<Conversation[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async upsertUserByGoogleId(userData: UpsertUser): Promise<User> {
    if (!userData.googleId) {
      throw new Error("googleId is required");
    }

    const existingUser = await this.getUserByGoogleId(userData.googleId);
    
    if (existingUser) {
      const [user] = await db
        .update(users)
        .set({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.googleId, userData.googleId))
        .returning();
      return user;
    }

    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async incrementChatCount(userId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        chatCount: sql`${users.chatCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async saveMessage(userId: string, message: any): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .limit(1);

    if (conversation) {
      const messages = (conversation.messages as any[]) || [];
      messages.push(message);
      const [updated] = await db
        .update(conversations)
        .set({
          messages: messages,
          updatedAt: new Date(),
        })
        .where(eq(conversations.id, conversation.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(conversations)
        .values({
          userId,
          messages: [message],
        })
        .returning();
      return created;
    }
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId));
    return result;
  }
}

import { sql } from "drizzle-orm";
export const storage = new DatabaseStorage();
