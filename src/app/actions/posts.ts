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

  const postComments = await db.query.posts.findMany({
    where: eq(posts.parentId, postId),
  });

  fetch(`http://localhost:1999/parties/post/${postId}`, {
    method: "POST",
    body: JSON.stringify({
      type: "comment",
      data: { comments: postComments.length },
    }),
  });
  revalidatePath("/" + handle + "/" + postId);
}

export const likePost = async (userId: string, postId: string) => {};

export const unlikePost = async (userId: string, postId: string) => {
  await db
    .delete(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
};

export async function toggleLikePost(userId: string, postId: string) {
  const alreadyLiked = await db.query.likes.findFirst({
    where: and(eq(likes.userId, userId), eq(likes.postId, postId)),
  });

  alreadyLiked ? unlikePost(userId, postId) : likePost(userId, postId);

  const likesCount = await getLikesCount(postId);
  try {
    broadcast<{ type: "like"; data: number }>({
      party: "posts",
      roomId: postId,
      data: {
        type: "like",
        data: likesCount,
      },
    });
  } catch {
    revalidatePath("/");
  }
  broadcastLikes(postId);
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
  const QueryResult = z.number();
  type QueryResult = z.infer<typeof QueryResult>;

  const [totalNumOfLikes] = (
    await db.execute(
      sql.raw(`SELECT COUNT(*) from likes WHERE posts.id === '${postId}'`),
    )
  ).rows;

  return QueryResult.parse(totalNumOfLikes);
};

export const broadcastLikes = async (postId: string) => {
  const likesCount = await getLikesCount(postId);
  try {
    broadcast<{ type: "like"; data: number }>({
      party: "posts",
      roomId: postId,
      data: {
        type: "like",
        data: likesCount,
      },
    });
  } catch {
    revalidatePath("/");
  }
};

export async function submitBookmark({
  userId,
  postId,
  isBookmarked,
}: {
  userId: string;
  postId: string;
  isBookmarked: boolean;
}) {
  if (!isBookmarked) {
    await db.insert(bookmarks).values({ id: nanoid(), userId, postId });
  } else {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
  }
  revalidatePath("/bookmarks");
}

export async function removeBookmark() {}
