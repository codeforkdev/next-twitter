import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id", { length: 21 }).notNull().primaryKey(),
  handle: text("handle", { length: 32 }).notNull().unique(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  bookmarks: many(bookmarks),
  conversationParticipants: many(conversationParticipants),
}));

export const posts = sqliteTable("posts", {
  id: text("id", { length: 21 }).notNull().primaryKey(),
  userId: text("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  text: text("text", { length: 500 }).notNull(),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  bookmarks: many(bookmarks),
  likes: many(likes),
}));

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id", { length: 21 }).notNull().primaryKey(),
  userId: text("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  postId: text("post_id", { length: 21 })
    .notNull()
    .references(() => posts.id),
});

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));

export const likes = sqliteTable("likes", {
  id: text("id", { length: 21 }).notNull().primaryKey(),
  userId: text("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  postId: text("post_id", { length: 21 })
    .notNull()
    .references(() => posts.id),
});

export const likeRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const conversations = sqliteTable("conversation", {
  id: text("id", { length: 21 }).notNull().primaryKey(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(conversationMessages),
}));

export const conversationParticipants = sqliteTable(
  "conversation_participants",
  {
    id: text("id", { length: 21 }).notNull().primaryKey(),
    conversationId: text("conversation_id", { length: 21 }).notNull(),
    userId: text("user_id", { length: 21 }).notNull(),
  }
);

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
  })
);

export const conversationMessages = sqliteTable("conversation_messages", {
  id: text("id", { length: 21 }).notNull().primaryKey(),
  conversationId: text("conversation_id", { length: 21 }).notNull(),
  participantId: text("conversation_participant_id", {
    length: 21,
  }).notNull(),
  text: text("text").notNull(),
});

export const conversationMessagesRelations = relations(
  conversationMessages,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationMessages.conversationId],
      references: [conversations.id],
    }),
    sender: one(conversationParticipants, {
      fields: [conversationMessages.participantId],
      references: [conversationParticipants.id],
    }),
  })
);
