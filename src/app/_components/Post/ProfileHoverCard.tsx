"use client";
import * as HoverCard from "@radix-ui/react-hover-card";
import React from "react";
import { Spacer } from "../Spacer";
import { Avatar } from "../Avatar";
export default function ProfileHoverCard({
  children,
  displayName,
  handle,
  avatar,
}: {
  children: React.ReactNode;
  displayName: string;
  handle: string;
  avatar: string;
}) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          style={{
            boxShadow: "0px 0px 18px -6px rgba(255,255,255,0.75)",
          }}
          className="mt-3  w-[300px] rounded-xl bg-black p-4"
        >
          <div className="flex justify-between ">
            <Avatar src={avatar ?? ""} className="h-14 w-14" />
            <button className="h-fit self-start rounded-full border border-white/20 px-4 py-1 font-semibold">
              Following
            </button>
          </div>
          <Spacer className="my-1" />
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="text-sm text-white/40">@{handle}</p>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
