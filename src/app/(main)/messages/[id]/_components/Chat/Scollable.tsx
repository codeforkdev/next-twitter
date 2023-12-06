"use client";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatProvider";
import { cn } from "@/lib/utils";
export default function MessagesWindow({
  windowClassName,
  thumbClassName,
  scrollBarClassName,
  children,
}: {
  windowClassName?: string;
  thumbClassName?: string;
  scrollBarClassName?: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  const { messages } = useContext(ChatContext);
  const container = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // move scroll position to the bottom when a new message comes in and the user is near the bottom
    if (messages.length === 0) return;
    const newMessageEl = document.getElementById(
      messages[messages.length - 1].id,
    );
    if (!bottom.current || !container.current || !newMessageEl) return;

    const { clientHeight, scrollTop, scrollHeight } = container.current;
    if (
      scrollHeight - clientHeight - scrollTop <
      newMessageEl.clientHeight + 10
    )
      bottom.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea.Root
      type="auto"
      className={cn("flex-1 overflow-hidden", windowClassName)}
    >
      <ScrollArea.Viewport
        className="flex h-full flex-col gap-2 py-4 pl-2 pr-5"
        ref={container}
      >
        <div className="flex h-full flex-col gap-2 ">
          <div ref={top} />
          {children}
          <div ref={bottom} />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className={cn("h-full w-3 bg-white/30", scrollBarClassName)}
      >
        <ScrollArea.Thumb
          className={cn("w-full rounded-full bg-gray-500", thumbClassName)}
        />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
