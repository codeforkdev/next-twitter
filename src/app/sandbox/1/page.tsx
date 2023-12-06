"use client";
import useChat from "@/app/(main)/messages/[id]/_components/Chat/ChatStore";
import { nanoid } from "nanoid";

const messages = [{ id: "1234", text: "first message" }];

export default function Page() {
  const Chat = useChat({
    id: "1",
    messages,
    onSend: async ({ text }) => {
      return { id: nanoid(), text };
    },
  });

  return (
    <>
      <Chat.Messages>
        {(msg) => {
          return (
            <div key={msg.id} className="text-white">
              {msg.id}
            </div>
          );
        }}
      </Chat.Messages>
      <Chat.Input className="text-black" typingTimeout={300} />
      <Chat.Trigger>Trigger</Chat.Trigger>
      <button onClick={() => console.log(chatStore.messages)}>click me</button>
      <button onClick={() => console.log(chatStore.text)}>click me</button>
    </>
  );
}
