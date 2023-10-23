"use server";

import { db } from "@/drizzle/db";
import { bookmarks, likes, posts } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function submitPost({
  userId,
  text,
}: {
  userId: string;
  text: string;
}) {
  console.log("submit post");
  await db.insert(posts).values({ id: nanoid(), userId, text });
  revalidatePath("/home");
}

export async function submitReply({
  userId,
  text,
  handle,
  postId,
}: {
  userId: string;
  handle: string;
  text: string;
  postId: string;
}) {
  await db
    .insert(posts)
    .values({ id: nanoid(), text, userId, parentId: postId });
  revalidatePath("/" + handle + "/" + postId);
}

export async function submitLike({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  console.log("submiting like");
  await db.insert(likes).values({ id: nanoid(), userId, postId });
  const postLikes = await db.query.likes.findMany({
    where: eq(likes.postId, postId),
  });
  // fetch(`http://localhost:1999/parties/post/${postId}`, {
  //   method: "POST",
  //   body: JSON.stringify({ likes: postLikes.length }),
  // });
}

export async function submiteBookmark({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  await db.insert(bookmarks).values({ id: nanoid(), userId, postId });
}

export async function removeBookmark() {}
