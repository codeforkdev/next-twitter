"use client";
import {
  conversationMessages,
  conversationParticipants,
} from "@/server/db/schema";
import usePartySocket from "partysocket/react";
import React, { useState } from "react";
import { Message } from "./Message";
import { PKURL } from "@/app/_components/Post/constants";

type TMessage = typeof conversationMessages.$inferSelect & {
  participant: typeof conversationParticipants.$inferSelect;
};
export default function NewMessages({
  conversationId,
  userId,
}: {
  userId: string;
  conversationId: string;
}) {
  const [messages, setMessages] = useState<TMessage[]>([]);

  usePartySocket({
    room: conversationId,
    host: PKURL,
    onMessage: (evt: MessageEvent) => {
      setMessages((prev) => [...prev, JSON.parse(evt.data)]);
    },
  });

  return (
    <>
      {messages.map((msg) => (
        <li key={msg.id} className="border border-red-500">
          <Message
            participant={msg.participant}
            userId={userId}
            id={msg.id}
            createdAt={msg.createdAt}
          >
            {msg.text}
          </Message>
        </li>
      ))}
    </>
  );
}
