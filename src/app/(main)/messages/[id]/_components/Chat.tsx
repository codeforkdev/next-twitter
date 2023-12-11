"use client";
import { SendIcon } from "lucide-react";
import useChat from "./Chat/ChatStore";

export function Chat({ avatar }: { avatar: string }) {
  const { Chat } = useChat({
    id: "1",
    messages: [{ id: "123", text: "hello" }],
    onSend: async ({ text }) => {
      return { id: "1", text };
    },
  });
  return (
    <div className="flex h-full flex-col border-8">
      <Chat.Scrollable>
        <Chat.Messages>
          {({ text }) => {
            return <li>{text}</li>;
          }}
        </Chat.Messages>
      </Chat.Scrollable>

      <div className="">
        <div className="flex items-center gap-4 rounded-xl  bg-white/10 p-4 px-4 py-1">
          <Chat.Input
            className="flex-1 bg-transparent p-2 outline-none"
            typer={{ avatar, timeout: 5000 }}
          />
          <Chat.Trigger>
            <Chat.Trigger className="rotate-45 p-2 text-primary">
              <SendIcon size={16} />
            </Chat.Trigger>
          </Chat.Trigger>
        </div>
      </div>
    </div>
  );
}
