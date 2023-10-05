"use client";
import { createMessage } from "@/actions";
import usePartySocket from "partysocket/react";
import { ChangeEvent, useEffect, useState } from "react";

type ChatInputProps = {
  conversationId: string;
  participantId: string;
};
export default function ChatInput({
  conversationId,
  participantId,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const ws = usePartySocket({
    room: conversationId,
    host: "http://localhost:1999",
  });
  useEffect(() => {
    ws.addEventListener("message", (evt: MessageEvent) => {
      const data = JSON.parse(evt.data);

      console.log("Incoming data");
      console.log(data);
      setMessages((prev) => [...prev, JSON.parse(evt.data)]);
    });
    return () => ws.close();
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSendMessage = () => {
    createMessage({
      conversationId,
      participantId,
      text: value,
    });
  };
  return (
    <div className="flex">
      <input
        className="w-full flex-1 border text-black"
        onChange={handleInput}
        value={value}
      />
      <button className="p-2" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}
