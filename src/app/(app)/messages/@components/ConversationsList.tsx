import { conversationParticipants } from "../../../../drizzle/schema";
import ConversationListItem from "./ConversationListItem";
import { user } from "@/mock/mock-data";
import { eq } from "drizzle-orm";
import { db } from "../../../../drizzle/db";

export default async function ConversationsList() {
  const conversations = (
    await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.userId, user.id),
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
    })
  ).map((c) => c.conversation);
  return (
    <ol className="flex flex-col gap-[2px]">
      {conversations.map((c) => {
        let otherParticipants = c.participants.filter(
          (p) => p.userId !== user.id,
        );
        return (
          <li className="">
            <ConversationListItem
              avatar={otherParticipants[0].user.avatar ?? ""}
              id={c.id}
              displayName={otherParticipants[0].user.displayName}
            />
          </li>
        );
      })}
    </ol>
  );
}
