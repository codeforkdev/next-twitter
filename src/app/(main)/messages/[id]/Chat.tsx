"use client";
import { z } from "zod";
import { Root, Scrollable, Messages } from "./_components/Chat";
import { messageSchema } from "@/schemas";
import { cn } from "@/lib/utils";
export default function Chat({
  id,
  avatar,
  messages,
  participantId,
}: {
  id: string;
  avatar: string;
  messages: z.infer<typeof messageSchema>[];
  participantId: string;
}) {
  return (
    <div className="h-full">
      <Root
        room={id}
        avatar={avatar}
        initialMessages={messages}
        onSend={() => {
          return {};
        }}
      >
        <ol className="flex h-full flex-col border-2 border-blue-500">
          <Scrollable>
            <Messages>
              {(m) => {
                const myMsg = m.participantId === participantId;
                return (
                  <div
                    key={m.id}
                    className={cn("max-w-[65%]", { "self-end": myMsg })}
                  >
                    <p
                      className={cn("rounded-lg p-2", {
                        " bg-primary": myMsg,
                      })}
                    >
                      {m.text}
                    </p>
                    <p
                      className={cn("text-xs text-neutral-500", {
                        "text-right": myMsg,
                      })}
                    >
                      {m.createdAt.toLocaleDateString("en-us", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                );
              }}
            </Messages>
          </Scrollable>
        </ol>
        <div className="p-4">
          <Chat.Typers />
          <div className="flex items-center gap-4 rounded-xl  bg-white/10 p-4 px-4 py-1">
            <Chat.Input
              placeholder="Your something"
              className="flex-1 bg-transparent p-2 text-white outline-none"
              typingTimeout={3000}
            />
            <Chat.Trigger className="rotate-45 p-2 text-primary">
              <Send size={16} />
            </Chat.Trigger>
          </div>
        </div>
      </Root>
    </div>
  );
}
