"use client";
import { Avatar } from "@/app/_components/Avatar";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";

type Participant = {
  handle: string;
  displayName: string;
  avatar: string;
};

type LastMessage = {
  text: string;
  createdAt: Date;
};

type Props = {
  id: string;
  participants: Participant[];
  latestMessage: LastMessage | null;
  createdAt: Date;
};
export default function ConversationListItem({
  id,
  participants,
  latestMessage,
  createdAt,
}: Props) {
  const [openMore, setOpenMore] = useState(false);
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(pathname.endsWith(id));
  const [isHovered, setIsHovered] = useState(false);
  const isDM = participants.length === 1;

  useEffect(() => {
    setIsActive(pathname.endsWith(id));
  }, [pathname]);
  return (
    <Link
      href={"/messages/" + id}
      className={cn(
        `relative grid h-[72px] grid-cols-12 grid-rows-2 border-r-2 border-transparent p-2 transition-colors hover:bg-white/10`,
        { "border-primary bg-white/10": isActive },
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!openMore) setIsHovered(false);
      }}
    >
      <div className="col-span-2 row-span-3 flex items-center justify-center">
        {isDM ? (
          <Avatar src={participants[0].avatar} className="h-8 w-8 shrink-0" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center gap-1 rounded-full bg-primary">
            {participants.length}
          </div>
        )}
      </div>

      <div className="col-start-3 col-end-13 row-auto flex items-end gap-2">
        <div
          className={cn(
            "gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold",
            { "font-normal": isActive },
          )}
        >
          {participants.length === 1 ? (
            <>
              {participants[0].displayName}
              <span className="text-sm">@{participants[0].handle}</span>
            </>
          ) : (
            <>{participants.map((p) => p.displayName).join(", ")} </>
          )}
        </div>

        <span>·</span>
        <div className="whitespace-nowrap text-sm text-[#65696e]">
          {latestMessage
            ? latestMessage.createdAt.toLocaleDateString("en-us", {
                month: "short",
                day: "numeric",
              })
            : createdAt.toLocaleDateString("en-us", {
                month: "short",
                day: "numeric",
              })}
        </div>
        {isHovered && (
          <Popover.Root open={openMore} onOpenChange={setOpenMore}>
            <Popover.Trigger asChild>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenMore(true);
                }}
                className="group ml-auto rounded-full p-1  hover:bg-primary/20 "
              >
                <MoreHorizontal
                  size={16}
                  className="text-gray-400 group-hover:text-primary"
                />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="w-72 bg-red-500">
                Hello Mom
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </div>
      <div className="col-start-3 col-end-13 row-auto ">
        {latestMessage && (
          <p
            className={cn("text-sm text-[#65696e]", { "text-white": isActive })}
          >
            {latestMessage.text}
          </p>
        )}
      </div>
    </Link>
  );
}
