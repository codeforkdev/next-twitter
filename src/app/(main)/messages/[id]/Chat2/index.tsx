"use client";
import { PKURL } from "@/app/_components/Post/constants";
import { cn } from "@/lib/utils";
import { SendingSchema } from "@/server/party/chatprovider";
import * as Scroll from "@radix-ui/react-scroll-area";
import { ImageIcon, SendIcon, SmileIcon } from "lucide-react";
import { nanoid } from "nanoid";
import usePartySocket from "partysocket/react";
import React, { useRef, useState } from "react";

function useChat<T extends { id: string }>({
  room,
  initialMessages,
  onSend,
}: {
  room: string;
  initialMessages: T[];
  onSend: ({ text }: { text: string }) => Promise<Required<T>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<T[]>(initialMessages);

  const ws = usePartySocket({
    host: PKURL,
    room,
    party: "chatprovider",
    onMessage: (e) => {
      console.log(e.data);
    },
  });

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

  type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    typer?: {
      timeout: number;
      avatar: string;
    };
  };

  function Trigger(props: TriggerProps) {
    return (
      <button
        onClick={async () => {
          const text = inputRef.current?.value;
          if (!text) return;
          const newMessage = await onSend({ text });
          ws.send({ type: "message", message: newMessage } as SendingSchema);
          // setMessages((prev) => [...prev, newMessage]);
        }}
        {...props}
      />
    );
  }

  function ScrollArea({
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
      <Scroll.Root
        type="auto"
        className={cn(windowClassName, "overflow-y-hidden")}
      >
        <Scroll.Viewport
          // className="flex h-full flex-col gap-2 py-4 pl-2 pr-5"
          className="h-full overflow-y-auto"
          ref={container}
        >
          <div className="flex h-full flex-col gap-2 ">
            <div ref={top} />
            {children}
            <div ref={bottom} />
          </div>
        </Scroll.Viewport>
        <Scroll.Scrollbar
          className={cn("h-full w-3 bg-white/30 p-0.5", scrollBarClassName)}
        >
          <Scroll.Thumb className={cn("w-full bg-gray-500", thumbClassName)} />
        </Scroll.Scrollbar>
      </Scroll.Root>
    );
  }

  return { Messages, Input, Trigger, ScrollArea };
}

type MessageProps = {
  id: string;
  pariticpantId: string;
  text: string;
};
function Message(props: MessageProps) {
  return <div>{props.text}</div>;
}

export function Chat({
  id,
  messages,
  participantId,
}: {
  id: string;
  participantId: string;
  messages: { id: string; participantId: string; text: string }[];
}) {
  const { Messages, Input, Trigger, ScrollArea } = useChat({
    room: id,
    initialMessages: messages,
    onSend: async ({ text }) => {
      return { id: nanoid(), text, participantId };
    },
  });

  return (
    <>
      <ScrollArea
        windowClassName="flex-1 border-b border-neutral-700"
        thumbClassName="bg-neutral-700"
        scrollBarClassName="bg-neutral-900"
      >
        <Messages
          Message={({ id, participantId, text }) => {
            return (
              <Message text={text} id={id} pariticpantId={participantId} />
            );
          }}
        />
      </ScrollArea>

      <div className="p-2">
        <div className="flex gap-4 rounded-2xl bg-neutral-800 py-2 pl-4">
          <div className="flex items-center gap-4">
            <button className="text-primary">
              <ImageIcon size={16} />
            </button>
            <button className="text-primary">
              <div className="flex items-center justify-center rounded border border-primary p-[1px] text-[8px] font-semibold text-primary">
                Gif
              </div>
            </button>
            <button className="text-primary">
              <SmileIcon size={16} />
            </button>
          </div>

          <Input
            className="flex-1 bg-transparent outline-none"
            placeholder="Start a new message"
          />

          <Trigger className="rounded px-4 py-2 text-primary">
            <SendIcon size={18} className="rotate-45" />
          </Trigger>
        </div>
      </div>
    </>
  );
}
