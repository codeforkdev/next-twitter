import NewConversationModal from "@/components/NewConversationModal";
import { db } from "@/drizzle/db";
import { conversationParticipants, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import React from "react";
import Conversations from "./@components/Conversations";
import { user } from "@/mock/mock-data";
import { cn } from "@/lib/utils";
import { MailPlusIcon, SearchIcon, SettingsIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import Link from "next/link";
import ConversationListItem from "./@components/ConversationListItem";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const things = await db.query.conversations.findMany({
    with: {
      participants: {
        where: eq(conversationParticipants.userId, user.id),
      },
      messages: {
        limit: 1,
      },
    },
  });

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
    <div className={cn("flex w-full")}>
      <div className="w-[390px] border-r border-white/20">
        <ConversationsNavHeader />
        <div className="px-3 py-2">
          <Search />
        </div>
        <ol>
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
      </div>

      {/* <Conversations conversations={conversations} /> */}
      <div className="flex-1 border-r border-r-white/20">{children}</div>
    </div>
  );
}

const Search = () => {
  return (
    <div className="relative flex items-center gap-1 rounded-full border  border-white/20 p-2 px-3">
      <SearchIcon size={16} className="text-white/40" />
      <input
        type="text"
        placeholder="Search Direct Messaes"
        className="flex-1 bg-transparent outline-none placeholder:text-sm placeholder:text-white/40"
      />
    </div>
  );
};

const ConversationsNavHeader = () => {
  return (
    <div className="flex items-center gap-4 p-4 pt-3">
      <p className="text-white/200 mr-auto text-xl font-semibold">Messages</p>
      <SettingsButton />
      <NewConversationModal />
    </div>
  );
};

const SettingsButton = () => {
  return (
    <Link href="/messages/settings">
      <SettingsIcon size={20} />
    </Link>
  );
};
