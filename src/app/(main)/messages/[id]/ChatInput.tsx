"use client";
import { createMessage } from "@/actions/conversation";
import { Avatar } from "@/app/_components/Avatar";
import { PKURL } from "@/app/_components/Post/constants";
import { ImagePlusIcon, Send } from "lucide-react";
import usePartySocket from "partysocket/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "./_components/Chat/Input";
import Trigger from "./_components/Chat/Trigger";

type ChatInputProps = {
  conversationId: string;
  participantId: string;
  avatar: string;
};
export default function ChatInput({ avatar }: ChatInputProps) {
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
    </div>
  );
}
