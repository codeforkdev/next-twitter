"use server";
import db from "@/server/db";
import { bookmarks, likes, posts } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const LoginParams = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginParams = z.infer<typeof LoginParams>;

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
  postId,
}: {
  userId: string;
  text: string;
  postId: string;
}) {
  await db
    .insert(posts)
    .values({ id: nanoid(), text, userId, parentId: postId });

  const postComments = await db.query.posts.findMany({
    where: eq(posts.parentId, postId),
  });

  fetch(`http://localhost:1999/parties/post/${postId}`, {
    method: "POST",
    body: JSON.stringify({
      type: "comments",
      data: { comments: postComments.length },
    }),
  });
}

export const likePost = async (userId: string, postId: string) => {
  await db.insert(likes).values({ id: nanoid(), userId, postId });
};

export const unlikePost = async (userId: string, postId: string) => {
  await db
    .delete(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
};

export async function toggleLikePost(userId: string, postId: string) {
  try {
    const alreadyLiked = await db.query.likes.findFirst({
      where: and(eq(likes.userId, userId), eq(likes.postId, postId)),
    });

    if (alreadyLiked) {
      await unlikePost(userId, postId);
    } else {
      await likePost(userId, postId);
    }

    const count = await getLikesCount(postId);

    try {
      broadcast<{
        type: "likes";
        data: { userId: string; count: number; isLiked: boolean };
      }>({
        party: "post",
        roomId: postId,
        data: {
          type: "likes",
          data: {
            userId,
            count,
            isLiked: alreadyLiked ? false : true,
          },
        },
      });
    } catch {}
  } catch {}
}

type BroadcastProps<T> = {
  party: string;
  roomId: string;
  data: T;
};
export const broadcast = <T>(params: BroadcastProps<T>) => {
  fetch(`http://localhost:1999/parties/${params.party}/${params.roomId}`, {
    method: "POST",
    body: JSON.stringify(params.data),
  });
};

const getLikesCount = async (postId: string) => {
  const QueryResult = z.object({
    likes: z.coerce.number(),
  });
  type QueryResult = z.infer<typeof QueryResult>;

  const response = await db.execute(
    sql.raw(
      `SELECT COUNT(*) as 'likes' FROM likes WHERE likes.post_id = '${postId}'`,
    ),
  );
  return QueryResult.parse(response.rows[0]).likes;
};

export async function toggleBookmark({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  try {
    const isBookmarked = await db.query.bookmarks.findFirst({
      where: and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)),
    });
    if (!isBookmarked) {
      await db.insert(bookmarks).values({ id: nanoid(), userId, postId });
    } else {
      await db
        .delete(bookmarks)
        .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
    }
    return isBookmarked ? false : true;
  } catch {}
}

export async function removeBookmark() {}
