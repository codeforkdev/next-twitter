"use server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { db } from "@/drizzle/db";
import { bookmarks, likes, posts } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

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
