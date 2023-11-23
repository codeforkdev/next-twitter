"use client";
import { createMessage } from "@/actions/conversation";
import { Avatar } from "@/app/_components/Avatar";
import { PKURL } from "@/app/_components/Post/constants";
import { ImagePlusIcon, Send } from "lucide-react";
import usePartySocket from "partysocket/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type ChatInputProps = {
  conversationId: string;
  participantId: string;
  avatar: string;
};
export default function ChatInput({
  conversationId,
  participantId,
  avatar,
}: ChatInputProps) {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [typers, setTypers] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const ws = usePartySocket({
    room: "chat",
    host: PKURL,
    party: "chat",
    query: {
      user: avatar,
      typing: "false",
    },
    onMessage: (evt) => {
      type Data = {
        id: string;
        avatar: string;
      };
      const data = JSON.parse(evt.data) as Data[];

      const usersTyping = data
        .filter((i) => i.id !== ws.id)
        .map((i) => i.avatar);
      setTypers(() => usersTyping);
    },
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.trim();

    setValue(e.currentTarget.value);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    if (clean) {
      if (timeoutId.current === null) {
        ws.send(
          JSON.stringify({
            type: "typing",
            data: { user: { avatar, isTyping: true } },
          }),
        );
      }
      timeoutId.current = setTimeout(() => {
        timeoutId.current = null;
        ws.send(
          JSON.stringify({
            type: "typing",
            data: { user: { avatar, isTyping: false }, text: clean },
          }),
        );
      }, 3000);
    } else {
      ws.send(
        JSON.stringify({ type: "typing", data: { text: "", typing: false } }),
      );
    }
  };

  const handleSendMessage = () => {
    setValue("");
    ws.send(
      JSON.stringify({
        type: "typing",
        data: { user: { typing: false }, text: "" },
      }),
    );
    createMessage({
      conversationId,
      participantId,
      text: value,
    });
  };

  return (
    <div>
      <div className=" h-14  w-full p-2 text-white">
        {typers.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {typers.map((i) => {
                if (i === avatar) return;
                return <Avatar key={i} className="h-6 w-6 shrink-0" src={i} />;
              })}
            </div>

            <div className="flex h-8 w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-none bg-neutral-800">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary duration-1000" />
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary duration-500" />
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary duration-300" />
            </div>
          </div>
        )}
      </div>

      {/* <input type="text" onInput={handleInput} className="text-black" /> */}
      <div className="p-4">
        <div className="flex items-center gap-4 rounded-xl  bg-white/10 p-4 px-4 py-1">
          <ImagePlusIcon size={18} className="text-primary" />
          <div className="flex flex-1">
            <input
              className="flex-1 bg-transparent p-2 text-white outline-none"
              placeholder="Start a new message"
              onInput={handleInput}
              value={value}
              onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
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
    </div>
  );
}
