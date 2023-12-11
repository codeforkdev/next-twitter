"use client";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";

function useChat<T extends { id: string }>({
  initialMessages,
  onSend,
}: {
  initialMessages: T[];
  onSend: ({ text }: { text: string }) => Promise<Required<T>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<T[]>(initialMessages);

  function Messages({ Message }: { Message: (msg: T) => React.ReactNode }) {
    return <ol>{messages.map((message) => Message(message))}</ol>;
  }

  type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    typer?: {
      timeout: number;
      avatar: string;
    };
  };

  function Input(props: InputProps) {
    const { typer, ...restProps } = props;
    return <input ref={inputRef} {...restProps} />;
  }

  function Trigger() {
    return (
      <button
        onClick={async () => {
          const text = inputRef.current?.value;
          if (!text) return;
          const newMessage = await onSend({ text });
          setMessages((prev) => [...prev, newMessage]);
        }}
      >
        Send
      </button>
    );
  }

  return { Messages, Input, Trigger };
}

export function Chat() {
  const { Messages, Input, Trigger } = useChat({
    initialMessages: [{ id: "", text: "First Message" }],
    onSend: async ({ text }) => {
      return { id: nanoid(), text };
    },
  });

  return (
    <>
      <Input className="text-black" />
      <Messages
        Message={(message) => {
          return <div>{message.text}</div>;
        }}
      />
      <Trigger />
    </>
  );
}
