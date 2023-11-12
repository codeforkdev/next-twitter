"use client";
import { Avatar } from "@/app/_components/Avatar";
import { cn } from "@/lib/utils";
import {
  BellIcon,
  BellMinusIcon,
  FlagIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import { Spacer } from "@/app/_components/Spacer";
import { AvatarGrid } from "@/app/_components/AvatarGrid";

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
    setIsActive(pathname.includes(id));
  }, [pathname]);

  useEffect(() => {
    if (!openMore) setIsHovered(false);
  }, [openMore]);
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
      <div className="relative col-span-2 row-span-3 flex items-center justify-center">
        <div className="relative">
          <AvatarGrid
            images={participants.map((i) => i.avatar)}
            className="h-10 w-10"
          />
          {participants.length > 1 && (
            <div className="absolute -right-2  bottom-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-black  bg-neutral-600 text-xs text-white">
              {participants.length}
            </div>
          )}
        </div>
      </div>

      <div className="col-start-3 col-end-13 row-auto flex items-end gap-2">
        <div
          className={cn(
            "flex gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold",
            { "font-normal": isActive },
          )}
        >
          {participants.length === 1 ? (
            <>
              <span>{participants[0].displayName}</span>
              <span className="text-sm  text-[#65696e]">
                @{participants[0].handle}
              </span>
            </>
          ) : (
            <span>{participants.map((p) => p.displayName).join(", ")} </span>
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
              <Popover.Content asChild alignOffset={900}>
                <ul
                  className=" divide-y divide-gray-700 rounded-lg border border-gray-800 bg-black text-sm"
                  style={{
                    boxShadow: "0px 0px 18px -6px rgba(255,255,255,0.75)",
                  }}
                >
                  <li className="flex items-center gap-3 px-3 py-2.5 font-semibold">
                    <BellIcon size={17} />
                    <p>Pin conversation</p>
                  </li>
                  <li className="flex items-center gap-3 px-3 py-2.5 font-semibold">
                    <BellMinusIcon size={17} />
                    <p>Snooze conversation</p>
                  </li>
                  <li className="flex items-center gap-3 px-3 py-2.5 font-semibold">
                    <FlagIcon size={17} />
                    <p>Report conversation</p>
                  </li>
                  <li>
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button className="flex w-full items-center gap-3 px-3 py-2.5 font-semibold text-red-500">
                          <TrashIcon size={17} />
                          <p>Delete conversation</p>
                        </button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-white/10" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 max-w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black p-6">
                          <p className="text-lg font-bold text-[#e7e9ea]">
                            Leave conversation?
                          </p>
                          <Spacer className="pt-1" />
                          <p className="text-sm text-[#4f5356]">
                            This conversation will be deleted from your inbox.
                            Other people in the conversation will still be able
                            to see it.
                          </p>
                          <Spacer className="py-2" />
                          <div className="flex flex-col gap-3">
                            <button className="rounded-full bg-[#f4212e] py-2 text-sm font-semibold">
                              Leave
                            </button>
                            <Dialog.Close asChild>
                              <button className="rounded-full border border-[#4f5356] py-2 text-sm  font-semibold transition-colors hover:bg-white/10">
                                Cancel
                              </button>
                            </Dialog.Close>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </li>
                </ul>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </div>
      <div className="col-start-3 col-end-13 row-auto ">
        <p className={cn("text-sm text-[#65696e]", { "text-white": isActive })}>
          {latestMessage ? latestMessage.text : "no messages"}
        </p>
      </div>
    </Link>
  );
}
