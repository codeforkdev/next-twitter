import { conversationParticipants } from "@/server/db/schema";
import ConversationListItem, { Indicator } from "./ConversationListItem";
import { eq, sql } from "drizzle-orm";
import db from "@/server/db";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/app/_components/Avatar";
import { idSchema } from "@/schemas";
import { z } from "zod";
import { Users2 } from "lucide-react";

const getConversations = async (userId: string) => {
  const things = await db.query.conversationParticipants.findMany({
    where: eq(conversationParticipants.userId, userId),
    with: {
      conversation: {
        with: {
          participants: {
            with: {
              user: true,
            },
          },
          messages: {
            limit: 1,
          },
        },
      },
    },
  });
  return things.map((c) => c.conversation);
};

export default async function ConversationsList({
  userId,
}: {
  userId: string;
}) {
  const response = await db.execute(sql`
    SELECT p.conversation_id as id 
    FROM conversation_participants AS p
    JOIN users AS u on u.id = p.user_id
    WHERE u.id = ${userId}
  `);

  const query = sql.empty();
  const conversationIds = idSchema.array().parse(response.rows);

  const conversationTileSchema = z.object({
    conversationId: z.string(),
    messageId: z.string(),
    text: z.string(),
    createdAt: z.coerce.date(),
    participantId: z.string(),
    userId: z.string(),
    avatar: z.string(),
    handle: z.string(),
    displayName: z.string(),
  });

  const schema = z.object({
    conversationId: z.string(),
    // participantId: z.string(),
    latestMessage: z.string().nullable(),
    createdAt: z.coerce.date(),
    displayName: z.string(),
    avatar: z.string(),
  });

  if (conversationIds.length > 0) {
    console.log("BUILDING QUERY", conversationIds);

    for (let i = 0; i < conversationIds.length; i++) {
      query.append(sql`
      SELECT conversationId, text as latestMessage, displayName, avatar, createdAt
      FROM (
        SELECT p.id as participantId, conversation_id as conversationId, display_name as displayName, avatar
        FROM conversation_participants as p
        JOIN users as u on p.user_id = u.id
        WHERE conversation_id = ${conversationIds[i]} AND user_id != ${userId}
      ) as thing
      LEFT JOIN (
        SELECT conversation_id, text, created_at as createdAt
        FROM conversation_messages as m
        WHERE conversation_id = ${conversationIds[i]}
        ORDER BY created_at DESC
        LIMIT 1
      ) as latestMsg on thing.conversationId = latestMsg.conversation_id

      `);
      // query.append(
      //   sql`
      //     SELECT *
      //     FROM (
      //       SELECT m.conversation_id as conversationId, m.id as messageId, m.text, m.created_at as createdAt, p.id as participantId, u.id as userId, avatar, handle, display_name as displayName
      //       FROM conversation AS c
      //       LEFT JOIN conversation_messages AS m on c.id = m.conversation_id
      //       JOIN conversation_participants AS p ON m.conversation_participant_id = p.id
      //       JOIN users AS u ON p.user_id = u.id
      //       WHERE m.conversation_id = ${conversationIds[i]} ORDER BY m.created_at DESC LIMIT 1
      //     ) as a
      // `,
      // );
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
            participants: { displayName: string; avatar: string }[];
            latestMsg: { text: string; createdAt: Date } | null;
          }
        >,
        currentValue,
      ) => {
        const { conversationId, latestMessage, createdAt, ...participant } =
          currentValue;

        if (acc.has(conversationId)) {
          acc.get(conversationId)!.participants.push(participant);
        } else {
          acc.set(conversationId, {
            id: conversationId,
            participants: [participant],
            latestMsg: latestMessage
              ? { text: latestMessage, createdAt }
              : null,
          });
        }
        return acc;
      },
      new Map(),
    );

    console.log(result);
    console.log(result.keys());

    return (
      <ol className="flex flex-col gap-[2px]">
        {[...result.values()].map((tile) => {
          return (
            <li className="flex">
              <Indicator conversationId={tile.id}>
                <Link
                  href={"/messages/" + tile.id}
                  className="flex flex-1 items-start gap-4 p-2"
                >
                  {tile.participants.length > 1 ? (
                    <div className="flex h-10 w-10 items-center justify-center gap-1 rounded-full bg-primary">
                      {tile.participants.length}
                      <Users2 size={16} />
                    </div>
                  ) : (
                    <Avatar
                      src={tile.participants[0].avatar}
                      className="h-10 w-10"
                    />
                  )}
                  <div className="flex flex-col">
                    <div>
                      {tile.participants.map((p) => p.displayName)}{" "}
                      {tile.latestMsg?.createdAt.toDateString()}
                    </div>
                    <p>{tile.latestMsg?.text}</p>
                  </div>
                </Link>
              </Indicator>
            </li>
          );
        })}
        {/* {conversationTiles.map((tile) => {
          return (
            <li className="flex">
              <Link
                href={"/messages/" + tile.conversationId}
                className={cn(
                  "flex flex-1 items-center gap-4 px-5 py-3 transition-colors duration-200 hover:bg-white/10",
                )}
              >
                <Avatar src={tile.avatar} />
                <div className="flex-1">
                  <p>{tile.displayName}</p>
                  <p>hello there</p>
                </div>
              </Link>
            </li>
          );
        })} */}
      </ol>
    );
  }

  return <div></div>;
  // const conversations = await getConversations(userId);
}
