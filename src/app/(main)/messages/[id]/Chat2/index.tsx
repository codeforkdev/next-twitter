"use client";
import { cn } from "@/lib/utils";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";

function useChat<T extends { id: string }>({
  initialMessages,
  onSend,
}: {
  initialMessages: T[];
  onSend: ({ text }: { text: string }) => Promise<Required<T>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<T[]>(initialMessages);

  function Messages({ Message }: { Message: (msg: T) => React.ReactNode }) {
    return <ol>{messages.map((message) => Message(message))}</ol>;
  }

  type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    typer?: {
      timeout: number;
      avatar: string;
    };
  };

  function Input(props: InputProps) {
    const { typer, ...restProps } = props;
    return <input ref={inputRef} {...restProps} />;
  }

  function Trigger() {
    return (
      <button
        onClick={async () => {
          const text = inputRef.current?.value;
          if (!text) return;
          const newMessage = await onSend({ text });
          setMessages((prev) => [...prev, newMessage]);
        }}
      >
        Send
      </button>
    );
  }

  function Scrollable({
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
    const container = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const top = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //   // move scroll position to the bottom when a new message comes in and the user is near the bottom
    //   if (messages.length === 0) return;
    //   const newMessageEl = document.getElementById(
    //     messages[messages.length - 1].id,
    //   );
    //   if (!bottom.current || !container.current || !newMessageEl) return;
    //   const { clientHeight, scrollTop, scrollHeight } = container.current;
    //   if (
    //     scrollHeight - clientHeight - scrollTop <
    //     newMessageEl.clientHeight + 10
    //   )
    //     bottom.current.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

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

  return { Messages, Input, Trigger };
}

export function Chat() {
  const { Messages, Input, Trigger } = useChat({
    initialMessages: [{ id: "", text: "First Message" }],
    onSend: async ({ text }) => {
      return { id: nanoid(), text };
    },
  });

  return (
    <>
      <Input className="text-black" />
      <Messages
        Message={(message) => {
          return <div>{message.text}</div>;
        }}
      />
      <Trigger />
    </>
  );
}
