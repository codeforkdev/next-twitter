"use client";
import { faker } from "@faker-js/faker";
import createChat from "../../(main)/messages/[id]/_components/Chat";
import { SendIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { z } from "zod";
import { Avatar } from "@/app/_components/Avatar";
import { cn } from "@/lib/utils";

const user = {
  id: nanoid(),
  avatar: faker.image.avatar(),
  name: faker.person.firstName(),
};

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  const Chat = createChat({
    room: params.id,
    avatar: user.avatar,
    messageSchema: z.object({
      id: z.string(),
      text: z.string(),
      avatar: z.string(),
      userId: z.string(),
    }),
    onSend: ({ text }) => {
      const serverActionOrFetch = () => {
        return { id: nanoid(), text, avatar: user.avatar, userId: user.id };
      };

      return serverActionOrFetch();
    },
  });

  return (
    <div className="flex h-full flex-col">
      <Chat.Root>
        <Chat.Scrollable thumbClass="bg-red-500" trackClass="bg-gray-500">
          <Chat.Messages>
            {(m) => (
              <div className={cn({ "bg-green-500": user.id === m.userId })}>
                <p>{m.id}</p>
                <Avatar src={m.avatar} />
                <p>{m.text}</p>
              </div>
            )}
          </Chat.Messages>
        </Chat.Scrollable>
        <Chat.Typers />
        <div className="flex">
          <Chat.Input
            typingTimeout={3000}
            className="flex-1 border-2"
            placeholder="Your message"
          />
          <Chat.Trigger className="bg-blue-500 p-2 text-white">
            <SendIcon size={16} />
          </Chat.Trigger>
        </div>
      </Chat.Root>
    </div>
  );
}
