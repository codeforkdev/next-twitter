"use client";
import { PKURL } from "@/app/_components/Post/constants";
import { cn } from "@/lib/utils";
import { returningSchema, sendingSchema } from "@/server/party/chatprovider";
import usePartySocket from "partysocket/react";
import React, { FormEvent, createContext, useMemo, useRef } from "react";
import { z } from "zod";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { create } from "zustand";

interface ChatState<Message> {
  id: string;
  messages: Message[];
  text: string;
  appendMessage: (msg: Message) => void;
}

function createChatStore<T>({ id, messages }: { id: string; messages: T[] }) {
  return create<ChatState<T>>((set) => ({
    id,
    messages,
    text: "",
    appendMessage: (msg: T) => {
      console.log("store append message", msg);
      set((state) => {
        const newState = { ...state, messages: [...state.messages, msg] };
        console.log("new state", newState);
        return newState;
      });
    },
  }));
}

export default function useChat<T>({
  id,
  messages,
  onSend,
}: {
  id: string;
  messages: T[];
  onSend: ({ text }: { text: string }) => Promise<Required<T>>;
}) {
  console.log("rendering");
  const chatStore = useMemo(() => createChatStore<T>({ id, messages })(), []);
  const ws = usePartySocket({
    host: PKURL,
    room: id,
    party: "chatprovider",
    onMessage: (evt) => {
      const json = JSON.parse(evt.data);
      const data = returningSchema.parse(json);
      switch (data.type) {
        case "message":
          console.log("message event");
          console.log("msg: ", data.message);
          chatStore.appendMessage(data.message);

          break;
        case "typing":
          console.log("typing event");
          // setTypers(() =>
          //   data.typers.filter((typer) => typer.connId !== ws.id),
          // );
          break;
      }
    },
  });

  function sendValid(schema: z.infer<typeof sendingSchema>) {
    ws.send(JSON.stringify(schema));
  }

  async function sendMessage() {
    console.log(chatStore.text);
    const cleanText = chatStore.text.trim();

    if (!cleanText) return;
    const message = await onSend({
      text: cleanText,
    });
    chatStore.appendMessage(message);
    sendValid({ type: "message", message });
  }

  function Messages({ children }: { children: (msg: T) => React.ReactNode }) {
    return <ol>{chatStore.messages.map((msg) => children(msg))}</ol>;
  }

  type InputProps = React.ButtonHTMLAttributes<HTMLInputElement> & {
    typer: {
      timeout: number;
      avatar: string;
    };
  };

  function Input(props: InputProps) {
    const { typer, ...inputProps } = props;
    const isTyping = useRef<boolean>(false);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    function startTyping() {
      sendValid({ type: "typing", avatar: typer.avatar, typing: true });
    }

    function stopTyping() {
      sendValid({ type: "typing", typing: false });
    }

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
      chatStore.text = e.currentTarget.value;
      if (e.currentTarget.value) {
        if (!isTyping.current) {
          isTyping.current = true;
          startTyping();
          timeoutIdRef.current = setTimeout(stopTyping, props.typer.timeout);
          return;
        }
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = setTimeout(stopTyping, props.typer.timeout);
        }
      }
    };

    return (
      <input
        {...inputProps}
        className={cn(props.className)}
        // ref={inputRef}
        onInput={handleInput}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
      />
    );
  }

  type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
  function Trigger(props: Props) {
    return <button {...props} onClick={sendMessage} />;
  }

  function Scrollable({
    windowClassName,
    thumbClassName,
    scrollBarClassName,
    children,
  }: {
    windowClassName?: string;
    thumbClassName?: string;
    scrollBarClassName?: string;
    children: React.ReactNode | React.ReactNode[];
  }) {
    const container = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const top = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //   // move scroll position to the bottom when a new message comes in and the user is near the bottom
    //   if (messages.length === 0) return;
    //   const newMessageEl = document.getElementById(
    //     messages[messages.length - 1].id,
    //   );
    //   if (!bottom.current || !container.current || !newMessageEl) return;
    //   const { clientHeight, scrollTop, scrollHeight } = container.current;
    //   if (
    //     scrollHeight - clientHeight - scrollTop <
    //     newMessageEl.clientHeight + 10
    //   )
    //     bottom.current.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

    return (
      <ScrollArea.Root
        type="auto"
        className={cn(
          "h-full overflow-hidden border-4 border-red-500",
          windowClassName,
        )}
      >
        <ScrollArea.Viewport
          className="flex h-full flex-col gap-2 border-4 border-purple-500 py-4 pl-2 pr-5"
          ref={container}
        >
          <div className="flex h-full flex-col gap-2 ">
            <div ref={top} />
            {children}
            <div ref={bottom} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className={cn("h-full w-3 bg-white/30", scrollBarClassName)}
        >
          <ScrollArea.Thumb
            className={cn("w-full rounded-full bg-gray-500", thumbClassName)}
          />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    );
  }

  return {
    Chat: {
      Messages,
      Scrollable,
      Input,
      Trigger,
    },
  };
}