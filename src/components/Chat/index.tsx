"use client";

import { createMessage } from "@/actions";
import { user } from "@/mock-data";
import { useState, ChangeEvent } from "react";

type ChatProps = {
  conversationId: string;
  participantId: string;
};
export default function Chat({ conversationId, participantId }: ChatProps) {
  const [value, setValue] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const handleSendMessage = () => {
    createMessage({
      conversationId,
      participantId: participantId,
      text: value,
    });
  };
  return (
    <div className="h-full flex flex-col border-4 border-red-500 overflow-hidden">
      <div className="flex-1 border-2 border-green-500 overflow-y-auto">
        {new Array(100).fill(null).map((i) => (
          <li key={i}>text</li>
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
// import { Root } from "./root";
// import Input from "./input";
// import Trigger from "./trigger";
// import Messages from "./messages";

// export default { Root, Input, Trigger, Messages };
