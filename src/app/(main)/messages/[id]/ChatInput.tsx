"use client";
import { createMessage } from "@/actions/conversation";
import { ImagePlusIcon, Send } from "lucide-react";
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
    <div className="p-2">
      <div className="flex items-center gap-4 rounded-xl bg-white/10 px-4 py-1">
        <ImagePlusIcon size={18} className="text-primary" />
        <div className="flex flex-1">
          <input
            className="flex-1 bg-transparent p-2 text-white outline-none"
            placeholder="Start a new message"
            onInput={handleInput}
            value={value}
          />
          <button
            className="rotate-45 p-2 text-primary"
            onClick={handleSendMessage}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
