"use client";
import React, { useState } from "react";

type Message = {
  id: string;
  text: string;
};
export default function Messages({
  newMessage,
}: {
  newMessage: ({ id, text }: Message) => React.ReactNode;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg.id}>{newMessage(msg)}</li>
      ))}
    </ul>
  );
}
