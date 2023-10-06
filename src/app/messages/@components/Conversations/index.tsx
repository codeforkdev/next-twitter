"use client";
import NewConversationModal from "@/components/NewConversationModal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

type Props = {
  conversations: {
    id: string;
  }[];
};

export default function ({ conversations }: Props) {
  const activeConversationId = useSelectedLayoutSegment();

  return (
    <div
      className={cn("laptop:block border-r border-r-white/20 h-full", {
        "hidden ": activeConversationId,
        "w-full laptop:w-80 desktop:w-[389px]": !activeConversationId,
      })}
    >
      <div className="border-b">
        <NewConversationModal />
      </div>
      <ul className={cn("flex flex-col", {})}>
        {conversations?.map((conversation) => (
          <li key={conversation.id} className="border-b">
            <ConversationTile
              {...conversation}
              active={conversation.id === activeConversationId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConversationTile({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  return (
    <Link href={"/messages/" + id}>
      <div
        className={cn("p-2 border border-transparent", {
          "border-r-sky-500": active,
        })}
      >
        {id}
      </div>
    </Link>
  );
}
