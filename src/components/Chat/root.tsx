"use client";
import { createMessage } from "@/actions";
import React, { createContext, useState } from "react";

type ConversationContext = {
  conversationId: string;
  text: string;
  send: () => void;
  updateText: (val: string) => void;
};
export const ChatContext = createContext({
  conversationId: "",
  text: "",
  send: () => {},
  updateText: (val: string) => {},
});

export function Root({
  conversationId,
  participantId,
  children,
}: {
  conversationId: string;
  participantId: string;
  children: React.ReactNode;
}) {
  const [text, setText] = useState("");

  const send = () => {
    createMessage({
      conversationId,
      conversationParticipantId: participantId,
      text,
    });
  };
  const handleTextChange = (val: string) => {
    setText(val);
  };
  const updateText = (val: string) => {
    setText(val);
  };
  return (
    <ChatContext.Provider value={{ conversationId, text, send, updateText }}>
      {children}
    </ChatContext.Provider>
  );
}
