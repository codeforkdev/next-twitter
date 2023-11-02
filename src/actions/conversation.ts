"use server";

import db from "@/server/db";
import { conversationParticipants, conversations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    await db.transaction(async (tx) => {
      await tx.insert(conversations).values({ id: conversationId }),
        await tx.insert(conversationParticipants).values(
          [...userIds, userId].map((userId) => ({
            id: nanoid(),
            conversationId,
            userId,
          })),
        );
    });

    revalidatePath("/");
  }
};

type CreateMessageProps = {
  conversationId: string;
  participantId: string;
  text: string;
};

export const createMessage = async (message: CreateMessageProps) => {
  console.log(message);
  // const newMessage = (
  //   await db
  //     .insert(conversationMessages)
  //     .values({ id: nanoid(), ...message })
  //     .returning()
  // )[0];
  // fetch(`http://localhost:1999/parties/main/${message.conversationId}`, {
  //   method: "POST",
  //   body: JSON.stringify(newMessage),
  // });
  console.log("create new message", message);
};
