"use client";
import { createMessage } from "@/actions";
import { user } from "@/mock-data";
import { nanoid } from "nanoid";
import PartySocket from "partysocket";
import usePartySocket from "partysocket/react";
import { useState, ChangeEvent, useEffect } from "react";

type ChatProps = {
  conversationId: string;
  participantId: string;
};
export default function Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const ws = usePartySocket({ room: "1", host: "http://localhost:1999" });
  useEffect(() => {
    ws.addEventListener("message", (evt: MessageEvent) => {
      const data = JSON.parse(evt.data);

      console.log("Incoming data");
      console.log(data);
      setMessages((prev) => [...prev, JSON.parse(evt.data)]);
    });
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSendMessage = () => {
    console.log("send message");
    ws.send(JSON.stringify({ id: nanoid(), text: value }));
    // createMessage({
    //   conversationId,
    //   participantId: participantId,
    //   text: value,
    // });
  };
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto text-black">
        {messages.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </div>
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
    </div>
  );
}
