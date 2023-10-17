// import {
//   integer,
//   mysqlTable,
//   varchar,
//   uniqueIndex,
// } from "drizzle-orm/sqlite-core";
// import { relations, sql } from "drizzle-orm";

import { isNull, relations, sql } from "drizzle-orm";
import { char, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const id = varchar("id", { length: 21 }).primaryKey().notNull();

export const createdAt = timestamp("created_at", { mode: "date" })
  .notNull()
  .defaultNow();
export const users = mysqlTable("users", {
  id,
  handle: varchar("handle", { length: 21 }).notNull(),
  avatar: varchar("avatar", { length: 500 }),
  displayName: varchar("display_name", { length: 52 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  bookmarks: many(bookmarks),
  likes: many(likes),
  conversationParticipants: many(conversationParticipants),
}));

export const bookmarks = mysqlTable("bookmarks", {
  id,
  userId: char("user_id", { length: 21 }).notNull(),
  postId: varchar("post_id", { length: 21 }).notNull(),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [bookmarks.postId],
    references: [posts.id],
  }),
}));

export const likes = mysqlTable("likes", {
  id,
  userId: varchar("user_id", { length: 21 }).notNull(),
  postId: varchar("post_id", { length: 21 }).notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const posts = mysqlTable("posts", {
  id,
  parentId: char("parent_id", { length: 21 }),
  userId: char("user_id", { length: 21 }).notNull(),
  text: varchar("text", { length: 500 }).notNull(),
  createdAt,
});

export const postReplies = mysqlTable("post_replies", {
  id,
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  bookmarks: many(bookmarks),
  likes: many(likes),
}));

export const conversations = mysqlTable("conversation", {
  id,
});

export const conversationRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(conversationMessages),
}));

export const conversationMessages = mysqlTable("conversation_messages", {
  id,
  conversationId: varchar("conversation_id", { length: 21 }).notNull(),
  participantId: varchar("conversation_participant_id", {
    length: 21,
  }).notNull(),
  text: varchar("varchar", { length: 1000 }).notNull(),
  createdAt,
});

export const conversationMessagesRelations = relations(
  conversationMessages,
  ({ one, many }) => ({
    conversation: one(conversations, {
      fields: [conversationMessages.conversationId],
      references: [conversations.id],
    }),
    participant: one(conversationParticipants, {
      fields: [conversationMessages.participantId],
      references: [conversationParticipants.id],
    }),
  }),
);

export const conversationParticipants = mysqlTable(
  "conversation_participants",
  {
    id,
    conversationId: char("conversation_id", { length: 21 }).notNull(),
    userId: char("user_id", { length: 21 }).notNull(),
  },
);

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ many, one }) => ({
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    messges: many(conversationMessages),
  }),
);
export const followings = mysqlTable("following", {
  id,
  followerId: varchar("follower_id", { length: 21 }).notNull(),
  followingId: varchar("following_id", { length: 21 }).notNull(),
});
