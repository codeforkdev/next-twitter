import { conversationParticipants } from "@/server/db/schema";
import ConversationListItem from "./ConversationListItem";
import { eq } from "drizzle-orm";
import db from "@/server/db";

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
  const conversations = await getConversations(userId);
  return (
    <ol className="flex flex-col gap-[2px]">
      {/* {conversations.map((c) => {
        let otherParticipants = c.participants.filter(
          (p) => p.userId !== userId,
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
      })} */}
    </ol>
  );
}
