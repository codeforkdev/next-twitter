"use server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { db } from "../drizzle/db";
import { bookmarks, followings, likes, posts, users } from "../drizzle/schema";
import { and, eq, like, or } from "drizzle-orm";

export const submitPost = async ({
  userId,
  text,
}: {
  userId: string;
  text: string;
}) => {
  const id = nanoid();
  await db.insert(posts).values({ id, text, userId });
  revalidatePath("/");
};

export const toggleBookmark = async ({
  userId,
  postId,
  isBookmarked,
}: {
  userId: string;
  postId: string;
  isBookmarked: boolean;
}) => {
  if (isBookmarked) {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
  } else {
    const id = nanoid();
    await db.insert(bookmarks).values({ id, userId, postId });
  }

  revalidatePath("/");
};

export const toggleLike = async ({
  userId,
  postId,
  isLiked,
}: {
  userId: string;
  postId: string;
  isLiked: boolean;
}) => {
  if (isLiked) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
  } else {
    const id = nanoid();
    await db.insert(likes).values({ id, userId, postId });
  }

  revalidatePath("/");
};

export const followAction = async (
  isFollowing: boolean,
  followerId: string,
  followingId: string,
) => {
  console.log("Follow user");
  if (isFollowing) {
    console.log("unfollowing");
    await db
      .delete(followings)
      .where(
        and(
          eq(followings.followerId, followerId),
          eq(followings.followingId, followingId),
        ),
      );
  } else {
    console.log("following");
    await db
      .insert(followings)
      .values({ id: nanoid(), followerId, followingId });
  }
  revalidatePath("/");
  return {};
};
