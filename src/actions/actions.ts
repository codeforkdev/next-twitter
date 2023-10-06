"use server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { db } from "@/drizzle/db";
import {
  bookmarks,
  conversationMessages,
  conversationParticipants,
  conversations,
  followings,
  likes,
  posts,
  users,
} from "../drizzle/schema";
import { and, eq, inArray, like, or, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

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

export const searchUsers = async (term: string) => {
  const usersList = await db.query.users.findMany({
    where: or(
      like(users.handle, `%${term}%`),
      like(users.displayName, `%${term}%`)
    ),
  });

  return usersList;
};

export const createConversation = async (userId: string, userIds: string[]) => {
  const myConversations = (
    await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.userId, userId),
      with: {
        conversation: {
          with: {
            participants: true,
          },
        },
      },
    })
  )
    .map((c) => c.conversation)
    .filter((c) => c.participants.length === userIds.length + 1);

  let foundExistingConversation: null | string = null;

  for (let conversation of myConversations) {
    let matches = 0;
    for (let userId of userIds) {
      const match = conversation.participants.find((p) => p.userId === userId);
      if (match) matches++;
    }
    if (matches === userIds.length) {
      foundExistingConversation = conversation.id;
      break;
    }
  }

  if (foundExistingConversation) {
    console.log("found existing conversation", foundExistingConversation);
    redirect("/messages/" + foundExistingConversation);
  } else {
    console.log("creating new conversation");
    const conversationId = nanoid();
    await db.batch([
      db.insert(conversations).values({ id: conversationId }),
      db.insert(conversationParticipants).values(
        [...userIds, userId].map((userId) => ({
          id: nanoid(),
          conversationId,
          userId,
        }))
      ),
    ]);
    revalidatePath("/");
  }
};

type CreateMessageProps = {
  conversationId: string;
  participantId: string;
  text: string;
};

export const createMessage = async (message: CreateMessageProps) => {
  const newMessage = (
    await db
      .insert(conversationMessages)
      .values({ id: nanoid(), ...message })
      .returning()
  )[0];
  fetch(`http://localhost:1999/parties/main/${message.conversationId}`, {
    method: "POST",
    body: JSON.stringify(newMessage),
  });
  console.log("create new message", message);
};

export const followAction = async (
  isFollowing: boolean,
  followerId: string,
  followingId: string
) => {
  console.log("Follow user");
  if (isFollowing) {
    console.log("unfollowing");
    await db
      .delete(followings)
      .where(
        and(
          eq(followings.followerId, followerId),
          eq(followings.followingId, followingId)
        )
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
