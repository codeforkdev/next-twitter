"use client";

import { PKURL } from "@/app/_components/Post/constants";
import { faker } from "@faker-js/faker";
import usePartySocket from "partysocket/react";
import React, { useRef, useState } from "react";

export default function Page() {
  return <ChatInput />;
}

const user = faker.person.firstName();

const ChatInput = () => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState<string[]>([]);

  const ws = usePartySocket({
    room: "chat",
    host: PKURL,
    party: "chat",
    query: {
      user: user,
      typing: "false",
    },
    onMessage: (evt) => {
      const user = JSON.parse(evt.data) as { user: string; typing: boolean };
      console.log(user);
      if (user.typing) {
        setIsTyping((prev) => [user.user, ...prev]);
      } else {
        setIsTyping((prev) => prev.filter((i) => i !== user.user));
      }
    },
  });

  const handleInput = () => {
    ws.send(JSON.stringify({ type: "typing", data: { typing: true } }));
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      ws.send(JSON.stringify({ type: "typing", data: { typing: false } }));
    }, 3000);
  };

  return (
    <div>
      <ul className="flex h-10 gap-4 text-white">
        {isTyping.map((i) => (
          <li key={i}>{i} is typing...</li>
        ))}
      </ul>
      <input type="text" onInput={handleInput} className="text-black" />
    </div>
  );
};
