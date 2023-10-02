import { relations } from "drizzle-orm";
import { char, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: char("id", { length: 21 }).notNull().primaryKey(),
  handle: varchar("handle", { length: 32 }).notNull().unique(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  bookmarks: many(bookmarks),
}));

export const posts = mysqlTable("posts", {
  id: char("id", { length: 21 }).notNull().primaryKey(),
  userId: char("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  text: varchar("text", { length: 500 }).notNull(),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  bookmarks: many(bookmarks),
  likes: many(likes),
}));

export const bookmarks = mysqlTable("bookmarks", {
  id: char("id", { length: 21 }).notNull().primaryKey(),
  userId: char("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  postId: char("post_id", { length: 21 })
    .notNull()
    .references(() => posts.id),
});

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));

export const likes = mysqlTable("likes", {
  id: char("id", { length: 21 }).notNull().primaryKey(),
  userId: char("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  postId: char("post_id", { length: 21 })
    .notNull()
    .references(() => posts.id),
});

export const likeRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const conversations = mysqlTable("conversation", {
  id: char("id", { length: 21 }).notNull().primaryKey(),
});

export const conversationParticipants = mysqlTable(
  "conversation_participants",
  {
    id: char("id", { length: 21 }).notNull().primaryKey(),
    conversationId: char("conversation_id", { length: 21 }).notNull(),
    userId: char("user_id", { length: 21 }).notNull(),
  }
);
