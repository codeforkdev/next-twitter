"use client";
import { PKURL } from "@/app/_components/Post/constants";
import * as Scroll from "@radix-ui/react-scroll-area";
import { ImageIcon, SendIcon, SmileIcon } from "lucide-react";
import usePartySocket from "partysocket/react";
import React, {
  FormEvent,
  KeyboardEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendMessage, sendTypingStatus } from "./_actions";
import { Avatar } from "@/app/_components/Avatar";
import { z } from "zod";
import { ChatContext, ChatProvider } from "./Chat/Provider";

export function ScrollArea(props: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  return (
    <Scroll.Root
      type="auto"
      className="h-full overflow-y-hidden border-4 border-red-500"
    >
      <Scroll.Viewport className="h-full overflow-y-auto" ref={container}>
        <div className="flex h-full flex-col gap-2 ">
          <div ref={top} />
          {props.children}
          <div ref={bottom} />
        </div>
      </Scroll.Viewport>
      <Scroll.Scrollbar className="h-full w-3 bg-white/30 p-0.5">
        <Scroll.Thumb className="w-full bg-gray-500" />
      </Scroll.Scrollbar>
    </Scroll.Root>
  );
}

function Message({ id, text, avatar, participantId, createdAt }: Message) {
  const ctx = useContext(ChatContext);

  if (participantId === ctx.participantId) {
    return (
      <li className="flex  justify-end">
        <div className="flex max-w-[50%] flex-col items-end gap-1">
          <p className="w-fit rounded-2xl bg-primary p-2">{text}</p>
          <p className="w-fit text-xs text-neutral-500">
            {createdAt.toLocaleDateString("us-en", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour12: true,
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </li>
    );
  } else {
    return (
      <li className="flex  justify-start">
        <div className="flex max-w-[50%] flex-col gap-1">
          <p className="w-fit rounded-2xl bg-neutral-600 p-2">{text}</p>
          <p className="w-fit text-xs text-neutral-500">
            {createdAt.toLocaleDateString("us-en", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour12: true,
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </li>
    );
  }
}

const messageSchema = z.object({
  id: z.string(),
  participantId: z.string(),
  text: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date(),
});

type Message = z.infer<typeof messageSchema>;

function Messages() {
  const { conversationId } = useContext(ChatContext);
  const [messages, setMessages] = useState<Message[]>([]);
  usePartySocket({
    host: PKURL,
    room: conversationId,
    party: "chat_message",
    onMessage: ({ data }) => {
      const message = messageSchema.parse(JSON.parse(data));
      setMessages((prev) => [...prev, message]);
    },
  });
  return (
    <ul>
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </ul>
  );
}

function Typers() {
  const { conversationId, participantId } = useContext(ChatContext);
  const [typers, setTypers] = useState<{ id: string; avatar: string }[]>([]);
  usePartySocket({
    host: PKURL,
    room: conversationId,
    party: "chat_typing",
    onMessage: ({ data }) => {
      const { status, ...typer } = JSON.parse(data);
      if (typer.id === participantId) return;
      if (status) {
        setTypers((prev) => [...prev, typer]);
      } else {
        setTypers(typers.filter((curr) => curr.id !== typer.id));
      }
    },
  });

  return (
    <ul className="flex gap-2">
      {typers.map((typer) => (
        <li key={typer.id}>
          <Avatar src={typer.avatar} />
        </li>
      ))}
      <li>
        <Avatar
          src="https://avatars.githubusercontent.com/u/142317935?v=4"
          className="opacity-0"
        />
      </li>
    </ul>
  );
}

export function Input() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { conversationId, participantId, avatar } = useContext(ChatContext);
  const [text, setText] = useState("");

  async function handleSendMsg() {
    const cleanText = text.trim();
    if (!cleanText) return;
    await sendMessage({
      conversationId,
      message: { text: cleanText, participantId },
    });

    setText("");
    notTyping();
  }

  function isTyping() {
    sendTypingStatus({ participantId, conversationId, avatar, status: true });
  }

  function notTyping() {
    timeoutRef.current = null;
    sendTypingStatus({ participantId, conversationId, avatar, status: false });
  }

  function handleInput(e: FormEvent<HTMLInputElement>) {
    setText(e.currentTarget.value);
  }

  async function handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      await handleSendMsg();
    }
  }

  useEffect(() => {
    if (!text.trim()) {
      if (timeoutRef.current) notTyping();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    } else {
      isTyping();
    }
    timeoutRef.current = setTimeout(() => {
      notTyping();
    }, 5000);
  }, [text]);
  return (
    <div className="p-2">
      <div className="flex gap-4 rounded-2xl bg-neutral-800 py-2 pl-4">
        <div className="flex items-center gap-4">
          <button className="text-primary">
            <ImageIcon size={16} />
          </button>
          <button className="text-primary">
            <div className="flex items-center justify-center rounded border border-primary p-[1px] text-[8px] font-semibold text-primary">
              Gif
            </div>
          </button>
          <button className="text-primary">
            <SmileIcon size={16} />
          </button>
        </div>

        <input
          value={text}
          onKeyUp={handleKeyUp}
          onInput={handleInput}
          className="flex-1 bg-transparent outline-none"
          placeholder="Start a new message"
        />

        <button
          onClick={handleSendMsg}
          className="rounded px-4 py-2 text-primary"
        >
          <SendIcon size={18} className="rotate-45" />
        </button>
      </div>
    </div>
  );
}

export function Chat(props: {
  conversationId: string;
  participantId: string;
  avatar: string;
}) {
  const { conversationId, participantId, avatar } = props;

  return (
    <ChatProvider
      conversationId={conversationId}
      participantId={participantId}
      avatar={avatar}
    >
      <div className="flex h-full flex-col border-4 border-green-500">
        <div className="flex-1">
          <ScrollArea>
            <Messages />
          </ScrollArea>
        </div>

        <Typers />
        <Input />
      </div>
    </ChatProvider>
  );
}
