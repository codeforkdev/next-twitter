import { db } from "@/drizzle/db";
import {
  conversationParticipants,
  conversations,
} from "../../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import ChatInput from "./ChatInput";
import NewMessages from "./NewMessages";
import { user } from "@/mock/mock-data";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";

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

  const otherParticipant = participant.conversation.participants[0].user;
  return (
    <div className="flex h-full flex-col  overflow-hidden ">
      <div className="flex justify-between p-4">
        <p className="text-lg font-semibold text-white/90">
          {participant.conversation.participants[0].user.displayName}
        </p>
        <Link href={"/messages/" + params.id + "/info"}>
          <InfoIcon size={20} />
        </Link>
      </div>

      <div>
        <div className="flex flex-col items-center justify-center">
          <Avatar src={otherParticipant.avatar ?? ""} className="h-16 w-16" />
          <p>{otherParticipant.displayName}</p>
          <p>@{otherParticipant.handle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col  overflow-hidden">
          <ul className="flex-1 overflow-y-auto">
            {participant.conversation.messages.map((msg) => (
              <li key={msg.id}>{msg.text}</li>
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
