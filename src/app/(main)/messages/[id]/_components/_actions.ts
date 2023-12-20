"use server";

import { PKURL } from "@/app/_components/Post/constants";
import db from "@/server/db";
import { conversationMessages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function sendMessage({
  conversationId,
  message,
}: {
  conversationId: string;
  message: { text: string; participantId: string };
}) {
  const { text, participantId } = message;
  const id = nanoid();
  await db.insert(conversationMessages).values({
    id,
    conversationId,
    participantId,
    text,
  });

  const newMessage = await db.query.conversationMessages.findFirst({
    where: eq(conversationMessages.id, id),
    with: {
      participant: {
        with: {
          user: {
            columns: {
              password: false,
            },
          },
        },
      },
    },
  });

  if (!newMessage) throw new Error("New Message Not Found");

  const response = await fetch(
    `${PKURL}/parties/chat_message/${conversationId}`,
    {
      method: "POST",
      body: JSON.stringify({
        id: newMessage.id,
        text: newMessage.text,
        avatar: newMessage.participant.user.avatar,
        participantId: newMessage.participantId,
        createdAt: newMessage.createdAt,
      }),
    },
  );
  console.log(response);
}

export async function sendTypingStatus({
  participantId,
  conversationId,
  avatar,
  status,
}: {
  participantId: string;
  conversationId: string;
  avatar: string;
  status: boolean;
}) {
  await fetch(`${PKURL}/parties/chat_typing/${conversationId}`, {
    method: "POST",
    body: JSON.stringify({ id: participantId, status, avatar }),
    next: { revalidate: 0 },
  });
}
