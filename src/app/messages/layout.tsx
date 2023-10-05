import NewConversationModal from "@/components/NewConversationModal";
import { db } from "@/drizzle/db";
import { conversationParticipants } from "@/drizzle/schema";
import { user } from "@/mock-data";
import { eq } from "drizzle-orm";
import React from "react";
import Conversations from "./Conversations";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = (
    await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.userId, user.id),
      with: {
        conversation: true,
      },
    })
  ).map((c) => c.conversation);
  return (
    <div className="h-full flex">
      <Conversations conversations={conversations} />
      <div className="flex-1 border-r border-r-white/20">{children}</div>
    </div>
  );
}
