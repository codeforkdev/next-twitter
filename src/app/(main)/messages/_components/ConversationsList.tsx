import ConversationListItem from "./ConversationListItem";
import { sql } from "drizzle-orm";
import db from "@/server/db";
import { idSchema } from "@/schemas";
import { z } from "zod";

export default async function ConversationsList({
  userId,
}: {
  userId: string;
}) {
  const response = await db.execute(sql`
    SELECT p.conversation_id as id 
    FROM conversation_participants AS p
    WHERE p.user_id = ${userId}
  `);

  const query = sql.empty();
  const conversationIds = idSchema.array().parse(response.rows);

  const schema = z.object({
    conversationId: z.string(),
    latestMessage: z.string().nullable(),
    createdAt: z.coerce.date(),
    messageCreatedAt: z.coerce.date(),
    handle: z.string(),
    displayName: z.string(),
    avatar: z.string(),
  });

  if (conversationIds.length > 0) {
    console.log("BUILDING QUERY", conversationIds);

    for (let i = 0; i < conversationIds.length; i++) {
      query.append(sql`
      SELECT conversationId, text as latestMessage, displayName, avatar, createdAt, handle, messageCreatedAt
      FROM (
        SELECT p.id as participantId, conversation_id as conversationId, display_name as displayName, avatar, handle, c.created_at as createdAt
        FROM conversation_participants as p
        JOIN users as u on p.user_id = u.id
        JOIN conversation as c on p.conversation_id = c.id
        WHERE conversation_id = ${conversationIds[i]} AND user_id != ${userId}
      ) as thing
      LEFT JOIN (
        SELECT conversation_id, text, created_at as messageCreatedAt
        FROM conversation_messages as m
        WHERE conversation_id = ${conversationIds[i]}
        ORDER BY created_at DESC
        LIMIT 1
      ) as latestMsg on thing.conversationId = latestMsg.conversation_id

      `);

      if (i !== conversationIds.length - 1) {
        query.append(sql`UNION`);
      }
    }

    const r = await db.execute(query);
    const v = schema.array().parse(r.rows);
    console.log("ROWS: ", r.rows);

    const result = v.reduce(
      (
        acc: Map<
          string,
          {
            id: string;
            createdAt: Date;
            participants: {
              handle: string;
              displayName: string;
              avatar: string;
            }[];
            latestMessage: { text: string; createdAt: Date } | null;
          }
        >,
        currentValue,
      ) => {
        const {
          conversationId,
          latestMessage,
          createdAt,
          messageCreatedAt,
          ...participant
        } = currentValue;

        if (acc.has(conversationId)) {
          acc.get(conversationId)!.participants.push(participant);
        } else {
          acc.set(conversationId, {
            id: conversationId,
            createdAt,
            participants: [participant],
            latestMessage: latestMessage
              ? { text: latestMessage, createdAt: messageCreatedAt }
              : null,
          });
        }
        return acc;
      },
      new Map(),
    );

    return (
      <ol className="flex flex-col gap-[2px] ">
        {[...result.values()].map((tile) => {
          return (
            <li key={tile.id}>
              <ConversationListItem
                id={tile.id}
                latestMessage={tile.latestMessage}
                participants={tile.participants}
                createdAt={tile.createdAt}
              />
            </li>
          );
        })}
      </ol>
    );
  }
}
