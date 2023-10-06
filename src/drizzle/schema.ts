import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
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
      .references(() => users.id),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
  },
  (table) => {
    return {
      handleUnique: uniqueIndex("likes_user_post_unique").on(
        table.userId,
        table.postId
      ),
    };
  }
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

export const conversationMessages = sqliteTable("conversation_messages", {
  id: text("id").primaryKey().notNull(),
  conversationId: text("conversation_id").notNull(),
  conversationParticipantId: text("conversation_participant_id").notNull(),
  text: text("text").notNull(),
});

export const conversationParticipants = sqliteTable(
  "conversation_participants",
  {
    id: text("id").primaryKey().notNull(),
    conversationId: text("conversation_id").notNull(),
    userId: text("user_id").notNull(),
  }
);

export const conversation = sqliteTable("conversation", {
  id: text("id").primaryKey().notNull(),
});

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
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  bookmarks: many(bookmarks),
  likes: many(likes),
  // followers: many(usersToFollowers),
  // following: many(usersToFollowings),
}));

export const followings = sqliteTable("following", {
  id: text("id").primaryKey().notNull(),
  followerId: text("follower_id")
    .notNull()
    .references(() => users.id),
  followingId: text("following_id").notNull(),
});

// export const usersToFollowings = sqliteTable("users_following", {
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   followingId: text("following_id")
//     .notNull()
//     .references(() => followings.followingId),
// });

// export const usersToFollowers = sqliteTable("users_followers", {
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   followerId: text("follower_id")
//     .notNull()
//     .references(() => followings.followerId),
// });

// export const usersToFollowersRelations = relations(
//   usersToFollowers,
//   ({ one, many }) => ({
//     user: one(users, {
//       fields: [usersToFollowers.userId],
//       references: [users.id],
//     }),
//   })
// );
