import { sql } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeftIcon, InfoIcon, Send } from "lucide-react";
import React from "react";
import db from "@/server/db";
import { z } from "zod";
import { messageSchema } from "@/schemas";
import { Avatar } from "@/app/_components/Avatar";
import { AvatarGrid } from "@/app/_components/AvatarGrid";
import { getUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Chat } from "./Chat2";

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
  const user = await getUser();
  if (!user) redirect("/login");

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
    SELECT m.id, text, m.created_at as createdAt, p.id as participantId, u.id as userId, handle, avatar, display_name as displayName 
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

      <div />

      <Chat />
      {/* <Chat avatar={user.avatar} /> */}
      {/* <ol className="flex h-full flex-col border-2 border-blue-500">
          <Chat.Scrollable>
            <Chat.Messages>
              {(m) => {
                return <div />;
                //  const myMsg = m.participantId === participantId;
                //  return (
                //    <div
                //      key={m.id}
                //      className={cn("max-w-[65%]", { "self-end": myMsg })}
                //    >
                //      <p
                //        className={cn("rounded-lg p-2", {
                //          " bg-primary": myMsg,
                //        })}
                //      >
                //        {m.text}
                //      </p>
                //      <p
                //        className={cn("text-xs text-neutral-500", {
                //          "text-right": myMsg,
                //        })}
                //      >
                //        {m.createdAt.toLocaleDateString("en-us", {
                //          month: "short",
                //          year: "numeric",
                //        })}
                //      </p>
                //    </div>
                //  );
              }}
            </Chat.Messages>
          </Chat.Scrollable>
        </ol>
        <div className="p-4">
          <Chat.Typers />
          <div className="flex items-center gap-4 rounded-xl  bg-white/10 p-4 px-4 py-1">
            <Chat.Input
              placeholder="Your something"
              className="flex-1 bg-transparent p-2 text-white outline-none"
              typingTimeout={3000}
            />
            <Chat.Trigger className="rotate-45 p-2 text-primary">
              <Send size={16} />
            </Chat.Trigger>
          </div>
        </div> */}
      {/* </Chat.Root> */}
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
          <li key={p.id}>
            {p.displayName}
            {i < participants.length - 1 && ", "}
          </li>
        );
      })}
    </ul>
  );
};
