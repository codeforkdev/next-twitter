import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Many, relations } from "drizzle-orm";
import { user } from "@/mock/mock-data";

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
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

export const likes = sqliteTable(
  "likes",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      handleUnique: uniqueIndex("likes_user_post_unique").on(
        table.userId,
        table.postId,
      ),
    };
  },
);

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

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  bookmarks: many(bookmarks),
  likes: many(likes),
}));

export const conversations = sqliteTable("conversation", {
  id: text("id").primaryKey().notNull(),
});

export const conversationRelations = relations(
  conversations,
  ({ one, many }) => ({
    participants: many(conversationParticipants),
    messages: many(conversationMessages),
  }),
);

export const conversationMessages = sqliteTable("conversation_messages", {
  id: text("id").primaryKey().notNull(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  conversationParticipantId: text("conversation_participant_id")
    .notNull()
    .references(() => conversationParticipants.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
});

export const conversationMessagesRelations = relations(
  conversationMessages,
  ({ one, many }) => ({
    conversation: one(conversations, {
      fields: [conversationMessages.conversationId],
      references: [conversations.id],
    }),
    participant: one(conversationParticipants, {
      fields: [conversationMessages.conversationParticipantId],
      references: [conversationParticipants.id],
    }),
  }),
);

export const conversationParticipants = sqliteTable(
  "conversation_participants",
  {
    id: text("id").primaryKey().notNull(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    handle: text("handle").notNull(),
    avatar: text("avatar"),
    displayName: text("display_name").notNull(),
  },
  (table) => {
    return {
      handleUnique: uniqueIndex("users_handle_unique").on(table.handle),
    };
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  bookmarks: many(bookmarks),
  likes: many(likes),
  conversationParticipants: many(conversationParticipants),
}));

export const followings = sqliteTable("following", {
  id: text("id").primaryKey().notNull(),
  followerId: text("follower_id").notNull(),
  followingId: text("following_id").notNull(),
});
