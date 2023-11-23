"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import usePartySocket from "partysocket/react";
import { TMessage, messageSchema } from "@/schemas";
import { getMessagesByDate } from "@/actions/chat";
import { PKURL } from "@/app/_components/Post/constants";

type Props = {
  id: string;
  userId: string;
  messages: TMessage[];
};
export default function Conversation(props: Props) {
  const container = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<TMessage[]>(props.messages ?? []);

  usePartySocket({
    room: props.id,
    host: PKURL,
    party: "chat",

    onMessage: (evt: MessageEvent) => {
      console.log(evt);
      const msg = messageSchema.parse(JSON.parse(evt.data));
      setMessages((prev) => [...prev, msg]);
    },
  });

  const getOlderMessages = async () => {
    console.log("first message: ", messages[0]);
    const oldMessages = await getMessagesByDate({
      conversationId: props.id,
      date: messages[0].createdAt,
      limit: 2,
    });

    console.log(oldMessages);

    // setMessages((prev) => [...oldMessages, ...prev]);
  };

  useEffect(() => {
    bottom.current?.scrollIntoView();
    if (!top.current) return;
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && messages.length > 0) {
          console.log("fetch older messages", messages[0].createdAt);
          // await getOlderMessages();
        }
      });
    }, {});
    observer.observe(top.current);
  }, []);

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
    <ScrollArea.Root type="auto" className="flex-1 overflow-hidden">
      <ScrollArea.Viewport
        className="flex h-full flex-col gap-2 py-4 pl-2 pr-5"
        ref={container}
      >
        <div className="flex h-full flex-col gap-2 ">
          <div ref={top} />
          {messages.map((m) => (
            <Message
              id={m.id}
              key={m.id}
              userId={props.userId}
              participant={{ userId: m.userId }}
              createdAt={m.createdAt}
            >
              {m.text}
            </Message>
          ))}
          <div ref={bottom} />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="h-full w-3 bg-white/30">
        <ScrollArea.Thumb className="w-full rounded-full bg-gray-500" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
