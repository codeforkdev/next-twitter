import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  datetime,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const id = varchar("id", { length: 21 }).primaryKey().notNull();

export const createdAt = timestamp("created_at", { mode: "date" })
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`);

export const sessions = mysqlTable("sessions", {
  id,
  userId: char("user_id", { length: 21 }).notNull(),
  createdAt,
  expireAt: timestamp("expire_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const users = mysqlTable("users", {
  id,
  // check for comfy email length
  email: varchar("email", { length: 125 }).notNull(),
  password: varchar("password", { length: 62 }).notNull(),
  handle: varchar("handle", { length: 21 }).notNull(),
  displayName: varchar("display_name", { length: 52 }).notNull(),
  avatar: varchar("avatar", { length: 500 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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

export const views = mysqlTable("post_views", {
  id,
  userId: char("user_id", { length: 21 }).notNull(),
  postId: char("post_id", { length: 24 }).notNull(),
  createdAt,
});

export const viewsRelations = relations(views, ({ one }) => ({
  viewer: one(users, {
    fields: [views.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [views.postId],
    references: [posts.id],
  }),
}));

export const posts = mysqlTable("posts", {
  id,
  parentId: char("parent_id", { length: 21 }),
  repost: boolean("repost").notNull().default(false),
  userId: char("user_id", { length: 21 }).notNull(),
  text: varchar("text", { length: 500 }).notNull(),
  pollId: varchar("poll_id", { length: 21 }),
  giphy: varchar("giphy", { length: 500 }),
  image: varchar("image", { length: 500 }),
  createdAt,
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  poll: one(polls, {
    fields: [posts.pollId],
    references: [polls.id],
  }),
  bookmarks: many(bookmarks),
  likes: many(likes),
  views: many(views),
}));

export const conversations = mysqlTable("conversation", {
  id,
  createdAt,
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
  text: varchar("text", { length: 1000 }).notNull(),
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

export const polls = mysqlTable("polls", {
  id,
  postId: varchar("post_id", { length: 21 }).notNull(),
  authorId: varchar("author_id", { length: 21 }).notNull(),
  expiry: datetime("expiry", { mode: "date" }).notNull(),
  createdAt,
});

export const pollRelations = relations(polls, ({ one, many }) => ({
  post: one(posts, {
    fields: [polls.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [polls.authorId],
    references: [users.id],
  }),
  options: many(pollOptions),
}));

export const pollOptions = mysqlTable("poll_options", {
  id,
  pollId: varchar("poll_id", { length: 21 }).notNull(),
  text: varchar("text", { length: 25 }).notNull(),
  createdAt,
});

export const pollOptionRelations = relations(pollOptions, ({ one, many }) => ({
  poll: one(polls, {
    fields: [pollOptions.pollId],
    references: [polls.id],
  }),
  votes: many(pollOptionVotes),
}));

export const pollOptionVotes = mysqlTable("poll_option_votes", {
  id,
  pollId: varchar("poll_id", { length: 21 }).notNull(),
  optionId: varchar("option_id", { length: 21 }).notNull(),
  voterId: varchar("voter_id", { length: 21 }).notNull(),
  createdAt,
});

export const pollOptionVotesRelations = relations(
  pollOptionVotes,
  ({ one, many }) => ({
    option: one(pollOptions, {
      fields: [pollOptionVotes.optionId],
      references: [pollOptions.id],
    }),
  }),
);
