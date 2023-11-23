"use server";
import { put } from "@vercel/blob";
import db from "@/server/db";
import { pollOptions, polls, posts } from "@/server/db/schema";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

type CreatePollParams = {
  userId: string;
  text: string;
  options: string[];
  expiry: {
    days: number;
    hours: number;
    minutes: number;
  };
};
export async function createPoll(params: CreatePollParams) {
  const { expiry, options, text, userId } = params;

  const e = dayjs()
    .add(expiry.days, "days")
    .add(expiry.hours, "hours")
    .add(expiry.minutes, "minutes");

  await db.transaction(async (tx) => {
    const postId = nanoid();
    const pollId = nanoid();
    await tx.insert(posts).values({ id: postId, text, userId, pollId });
    await tx.insert(polls).values({
      id: pollId,
      postId,
      authorId: params.userId,
      expiry: e.toDate(),
    });
    await tx
      .insert(pollOptions)
      .values(
        options.map((option) => ({ id: nanoid(), pollId, text: option })),
      );
  });
  revalidatePath("/");
}

type CreateGiphyPostParams = {
  userId: string;
  text: string;
  giphy: string;
};
export async function createGiphyPost({
  userId,
  text,
  giphy,
}: CreateGiphyPostParams) {
  await db.insert(posts).values({ id: nanoid(), text, userId, giphy });
  revalidatePath("/");
}

type CreateImagePostParams = {
  userId: string;
  text: string;
  imageUrl: string;
};

export async function createImagePost({
  userId,
  text,
  imageUrl,
}: CreateImagePostParams) {
  await db
    .insert(posts)
    .values({ userId, text, image: imageUrl, id: nanoid() });
  console.log("submit image post");
  revalidatePath("/");
}
