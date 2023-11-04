import { and, eq } from "drizzle-orm";
import ChatInput from "./ChatInput";
import NewMessages from "./NewMessages";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { Avatar } from "@/app/_components/Avatar";
import React from "react";
import { cn } from "@/lib/utils";
import db from "@/server/db";
import {
  conversationMessages,
  conversationParticipants,
} from "@/server/db/schema";
import { verifyJWT } from "@/lib/auth";
import { Message } from "./Message";

export default async function Page({ params }: { params: { id: string } }) {
  const {
    payload: { user },
  } = await verifyJWT();
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

  const messages = await db.query.conversationMessages.findMany({
    where: eq(conversationMessages.conversationId, params.id),
    with: {
      participant: true,
    },
  });

  if (!participant) {
    return <div>Do not belong in conversation</div>;
  }

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
            {messages.map((msg, i) => (
              <Message
                key={msg.id}
                userId={user.id}
                participant={msg.participant}
              >
                {msg.text}
              </Message>
            ))}
            <NewMessages
              conversationId={participant.conversationId}
              userId={user.id}
            />
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
