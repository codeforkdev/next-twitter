"use server";

import { messageSchema } from "@/schemas";
import db from "@/server/db";
import { sql } from "drizzle-orm";

type Params = {
  conversationId: string;
  date: Date;
  limit: number;
};
export async function getMessagesByDate(params: Params) {
  const messagesResponse = await db.execute(sql`
    SELECT m.id, text, m.created_at as createdAt, u.id as userId, handle, avatar, display_name as displayName 
    FROM conversation_messages AS m
    LEFT JOIN conversation_participants AS p ON p.id = m.conversation_participant_id
    LEFT JOIN users AS u ON p.user_id = u.id
WHERE m.conversation_id = ${params.conversationId} AND m.created_at < ${params.date}
    ORDER BY m.created_at DESC
    LIMIT ${params.limit}
    `);

  const messages = messageSchema.array().parse(messagesResponse.rows).reverse();
  return messages;
}
