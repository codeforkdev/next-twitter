import { db } from "@/drizzle/db";
import {
  conversationParticipants,
  conversations,
} from "../../../drizzle/schema";
import { user } from "@/mock-data";
import { and, eq } from "drizzle-orm";
import ChatInput from "./ChatInput";
import NewMessages from "./NewMessages";

export default async function Page({ params }: { params: { id: string } }) {
  const participant = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.userId, user.id),
      eq(conversationParticipants.conversationId, params.id)
    ),
    with: {
      conversation: {
        with: {
          participants: true,
          messages: true,
        },
      },
    },
  });

  if (!participant) {
    return <div>Do not belong in conversation</div>;
  }
  return (
    <div className="h-full flex flex-col  overflow-hidden ">
      <div>id: {params.id}</div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col  overflow-hidden">
          <ul className="flex-1 overflow-y-auto">
            {participant.conversation.messages.map((msg) => (
              <li key={msg.id}>{msg.text}</li>
            ))}
            <NewMessages conversationId={participant.conversationId} />
          </ul>
          <ChatInput
            conversationId={participant.conversationId}
            participantId={participant.id}
          />
        </div>
      </div>
    </div>
  );
}
