// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `task-tackler-4_${name}`);

export const users = createTable(
  "users",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

    clerkId: text("clerk_id"),
    userId: text("user_id"), // word.word
    isSpecial: boolean("is_special"),
    friendIds: json("friend_ids"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

export const messages = createTable(
  "messages",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),

    userOneId: text("user_one_id"),
    userTwoId: text("user_two_id"),
    content: json("content"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);