"use client";
import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";

export default function NewMessages({
  conversationId,
}: {
  conversationId: string;
}) {
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const ws = usePartySocket({
    room: conversationId,
    host: "http://localhost:1999",
  });

  useEffect(() => {
    ws.addEventListener("message", (evt: MessageEvent) => {
      setMessages((prev) => [...prev, JSON.parse(evt.data)]);
    });
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [conversationId]);
  return (
    <>
      {messages.map((msg) => (
        <li key={msg.id}>{msg.text}</li>
      ))}
    </>
  );
}
