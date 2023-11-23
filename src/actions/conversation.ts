"use server";

import { messageSchema } from "@/schemas";
import db from "@/server/db";
import {
  conversationMessages,
  conversationParticipants,
  conversations,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { broadcast } from "./posts";

export const createConversation = async (userIds: string[]) => {
  const conversationId = nanoid();
  await db.transaction(async (tx) => {
    await tx.insert(conversations).values({ id: conversationId });
    await tx.insert(conversationParticipants).values(
      userIds.map((userId) => ({
        id: nanoid(),
        conversationId,
        userId,
      })),
    );
  });
};

// export const createConversation = async (userId: string, userIds: string[]) => {
//   const myConversations = (
//     await db.query.conversationParticipants.findMany({
//       where: eq(conversationParticipants.userId, userId),
//       with: {
//         conversation: {
//           with: {
//             participants: true,
//           },
//         },
//       },
//     })
//   )
//     .map((c) => c.conversation)
//     .filter((c) => c.participants.length === userIds.length + 1);

//   let foundExistingConversation: null | string = null;

//   for (let conversation of myConversations) {
//     let matches = 0;
//     for (let userId of userIds) {
//       const match = conversation.participants.find((p) => p.userId === userId);
//       if (match) matches++;
//     }
//     if (matches === userIds.length) {
//       foundExistingConversation = conversation.id;
//       break;
//     }
//   }

//   if (foundExistingConversation) {
//     console.log("found existing conversation", foundExistingConversation);
//     redirect("/messages/" + foundExistingConversation);
//   } else {
//     console.log("creating new conversation");
//     const conversationId = nanoid();
//     await db.transaction(async (tx) => {
//       await tx.insert(conversations).values({ id: conversationId }),
//         await tx.insert(conversationParticipants).values(
//           [...userIds, userId].map((userId) => ({
//             id: nanoid(),
//             conversationId,
//             userId,
//           })),
//         );
//     });

// revalidatePath("/");
// }
// };

type CreateMessageProps = {
  conversationId: string;
  participantId: string;
  text: string;
};

export const createMessage = async (params: CreateMessageProps) => {
  const { conversationId, participantId, text } = params;
  const id = nanoid();
  await db
    .insert(conversationMessages)
    .values({ id, conversationId, participantId, text });

  const messagesResponse = await db.execute(sql`
    SELECT m.id, text, m.created_at as createdAt, u.id as userId, handle, avatar, display_name as displayName 
    FROM conversation_messages AS m
    LEFT JOIN conversation_participants AS p ON p.id = m.conversation_participant_id
    LEFT JOIN users AS u ON p.user_id = u.id
    WHERE m.id = ${id}
    `);

  const message = messageSchema.parse(messagesResponse.rows[0]);

  if (!message) return;
  broadcast({ party: "main", roomId: conversationId, data: message });
};
