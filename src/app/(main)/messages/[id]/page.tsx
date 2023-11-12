import { sql } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeftIcon, InfoIcon, MoveLeftIcon } from "lucide-react";
import React from "react";
import db from "@/server/db";

import { verifyJWT } from "@/lib/auth";
import { z } from "zod";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import { messageSchema } from "@/schemas";
import { Avatar } from "@/app/_components/Avatar";
import { AvatarGrid } from "@/app/_components/AvatarGrid";

const participantSchema = z.object({
  id: z.string(),
  userId: z.string(),
  handle: z.string(),
  avatar: z.string(),
  displayName: z.string(),
  joinedAt: z.coerce.date(),
});

type TParticipant = z.infer<typeof participantSchema>;

export default async function Page({ params }: { params: { id: string } }) {
  const {
    payload: { user },
  } = await verifyJWT();

  const participantsResponse = await db.execute(sql`
    SELECT u.id as userId, u.created_at as joinedAt, p.id, handle, avatar, display_name as displayName 
    FROM conversation_participants AS p
    LEFT JOIN users AS u on p.user_id = u.id
    WHERE conversation_id = ${params.id}
  `);
  const participants = participantSchema
    .array()
    .parse(participantsResponse.rows)
    .reduce(
      (acc, curr) => {
        if (curr.userId === user.id) {
          acc.user = curr;
        } else {
          acc.others.push(curr);
        }

        return acc;
      },
      { user: {} as TParticipant, others: [] as TParticipant[] },
    );

  const messagesResponse = await db.execute(sql`
    SELECT m.id, text, m.created_at as createdAt, u.id as userId, handle, avatar, display_name as displayName 
    FROM conversation_messages AS m
    LEFT JOIN conversation_participants AS p ON p.id = m.conversation_participant_id
    LEFT JOIN users AS u ON p.user_id = u.id
    WHERE m.conversation_id = ${params.id}
    ORDER BY m.created_at DESC
    LIMIT 18 
    `);

  const messages = messageSchema.array().parse(messagesResponse.rows).reverse();

  return (
    <div className="flex h-[100dvh] flex-col">
      <Header conversationId={params.id} participants={participants.others} />
      {participants.others.length === 1 && (
        <Link
          href={`/${participants.others[0].handle}`}
          className="flex flex-col items-center gap-1 border-b border-white/20 py-4 transition-colors hover:bg-neutral-600/20"
        >
          <Avatar className="h-14 w-14" src={participants.others[0].avatar} />
          <p>{participants.others[0].displayName}</p>
          <p className="text-neutral-600">@{participants.others[0].handle}</p>
          <p className="flex items-center gap-1 text-xs text-neutral-600">
            Joined{" "}
            {participants.others[0].joinedAt.toLocaleDateString("en-us", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </Link>
      )}
      <Conversation userId={user.id} id={params.id} messages={messages} />
      <ChatInput
        conversationId={params.id}
        participantId={participants.user.id}
        avatar={user.avatar}
      />
    </div>
  );
}

const Header = ({
  conversationId,
  participants,
}: {
  participants: TParticipant[];
  conversationId: string;
}) => {
  return (
    <header className="flex justify-between gap-3 p-4">
      <Link href="/messages" className="laptop:hidden">
        <ArrowLeftIcon size={20} />
      </Link>

      <AvatarGrid
        images={participants.map((i) => i.avatar)}
        className="h-6 w-6"
      />

      <Participants participants={participants} />

      <Link href={"/messages/" + conversationId + "/info"}>
        <InfoIcon size={20} />
      </Link>
    </header>
  );
};

const Participants = ({ participants }: { participants: TParticipant[] }) => {
  return (
    <ul className="flex flex-1 gap-2">
      {participants.map((p, i) => {
        return (
          <li>
            {p.displayName}
            {i < participants.length - 1 && ", "}
          </li>
        );
      })}
    </ul>
  );
};
