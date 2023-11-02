import { db } from "../../../../drizzle/db";
import { conversationParticipants } from "../../../../../server/db/schema";
import { and, eq } from "drizzle-orm";
import ChatInput from "./ChatInput";
import NewMessages from "./NewMessages";
import { user } from "@/mock/mock-data";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { Avatar } from "@/app/_components/Avatar";
import React from "react";
import { cn } from "@/lib/utils";

export default async function Page({ params }: { params: { id: string } }) {
  const participant = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.userId, user.id),
      eq(conversationParticipants.conversationId, params.id),
    ),
    with: {
      conversation: {
        with: {
          participants: {
            with: {
              user: true,
            },
          },
          messages: true,
        },
      },
    },
  });

  if (!participant) {
    return <div>Do not belong in conversation</div>;
  }

  console.log(participant);
  const otherParticipant = participant.conversation.participants[0].user;
  return (
    <div className="flex h-[100dvh] flex-col  overflow-hidden">
      <div className="flex justify-between p-4">
        <p className="text-lg font-semibold text-white/90">
          {participant.conversation.participants[0].user.displayName}
        </p>
        <Link href={"/messages/" + params.id + "/info"}>
          <InfoIcon size={20} />
        </Link>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col  overflow-hidden">
          <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <Avatar
                src={otherParticipant.avatar ?? ""}
                className="h-16 w-16"
              />
              <p>{otherParticipant.displayName}</p>
              <p>@{otherParticipant.handle}</p>
            </div>
            {participant.conversation.messages.map((msg, i) => (
              <Message idx={i} participant={participant}>
                {msg.text}
              </Message>
            ))}
            <NewMessages conversationId={participant.conversationId} />
          </ul>
          <div className="border-t border-white/20 p-2">
            <ChatInput
              conversationId={participant.conversationId}
              participantId={participant.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type MessageProps = {
  children: React.ReactNode;
  participant: typeof conversationParticipants.$inferSelect;
  idx: number;
};

const Message = (props: MessageProps) => {
  const isMe = props.idx % 2 === 0;
  // const isMe = user.id === props.participant.userId;

  return (
    <li
      className={cn("flex w-full", {
        "justify-end": isMe,
      })}
    >
      <div
        className={cn("flex max-w-[75%] flex-col ", {
          "items-end": isMe,
        })}
      >
        <div
          className={cn("flex max-w-[75%] rounded-2xl p-2", {
            "rounded-bl-sm bg-neutral-600": !isMe,
            "rounded-bl-0 justify-end rounded-br-sm border-blue-500 bg-blue-500":
              isMe,
          })}
        >
          <span>{props.children}</span>
        </div>
        <div className="text-xs">Yesterday 1:38pm</div>
      </div>
    </li>
  );
};
