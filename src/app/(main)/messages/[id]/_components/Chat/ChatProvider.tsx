"use client";
import { PKURL } from "@/app/_components/Post/constants";
import { messageSchema } from "@/schemas";
import { sendingSchema, returningSchema } from "@/server/party/chatprovider";
import usePartySocket from "partysocket/react";
import React, { RefObject, createContext, useRef, useState } from "react";
import { z } from "zod";

type TMessage = z.infer<typeof messageSchema>;
type TChatContext = {
  inputRef: RefObject<HTMLInputElement>;
  typers: { connId: string; avatar: string }[];
  send: (schema: z.infer<typeof sendingSchema>) => void;
  sendMessage: () => void;
  typing: {
    start: () => void;
    stop: () => void;
  };
};
export const ChatContext = createContext({});
export default function ChatProvider<T extends z.Schema>({
  room,
  children,
  avatar,
  messageSchema,
  onSubmit,
}: {
  onSubmit: ({ text }: { text: string }) => z.TypeOf<T>;
  room: string;
  children: React.ReactNode;
  avatar: string;
  messageSchema: T;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<z.TypeOf<T>[]>([]);
  const [typers, setTypers] = useState<{ connId: string; avatar: string }[]>(
    [],
  );
  const ws = usePartySocket({
    room,
    host: PKURL,
    party: "chatprovider",

    onMessage: (evt: MessageEvent) => {
      const json = JSON.parse(evt.data);
      const data = returningSchema.parse(json);
      switch (data.type) {
        case "message":
          console.log("message event");
          const message = messageSchema.parse(data.message);
          setMessages((prev) => [...prev, message]);
          break;
        case "typing":
          console.log("typing event");
          setTypers(() =>
            data.typers.filter((typer) => typer.connId !== ws.id),
          );
          break;
      }
    },
  });

  function send(schema: z.infer<typeof sendingSchema>) {
    ws.send(JSON.stringify(schema));
  }

  async function sendMessage() {
    if (!inputRef.current) return;
    const cleanText = inputRef.current.value.trim();

    if (!cleanText) return;
    const message = onSubmit({
      text: cleanText,
    });
    send({ type: "message", message });
  }

  const typing = {
    start() {
      send({
        type: "typing",
        avatar,
        typing: true,
      });
    },
    stop() {
      send({ type: "typing", typing: false });
    },
  };

  return (
    <ChatContext.Provider
      value={
        { typers, send, inputRef, sendMessage, typing, messages } satisfies {
          messages: z.TypeOf<T>[];
          inputRef: RefObject<HTMLInputElement>;
          typers: { connId: string; avatar: string }[];
          send: (schema: z.infer<typeof sendingSchema>) => void;
          sendMessage: () => void;
          typing: {
            start: () => void;
            stop: () => void;
          };
        }
      }
    >
      {children}
    </ChatContext.Provider>
  );
}
