"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import PartySocket from "partysocket";
import usePartySocket from "partysocket/react";
import { RefObject, createContext, useContext, useRef, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { PKURL } from "../_components/Post/constants";

export function chat<User, R extends z.Schema>(params: {
  room: string;
  user: User;
  message: R;
}) {
  const InputSchema = z.object({ text: z.string() });
  type Input = z.infer<typeof InputSchema>;
  type Message = z.infer<typeof params.message>;
  type TChatContext = {
    messages: Message[];
    ws: PartySocket;
    send: () => void;
    formRef: RefObject<HTMLFormElement>;
  };
  const ChatContext = createContext({} as TChatContext);

  function Root({
    children,
    onSubmit,
  }: {
    children: React.ReactNode;
    onSubmit: (data: Input) => Message;
  }) {
    const methods = useForm<Input>({
      resolver: zodResolver(InputSchema),
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = usePartySocket({
      room: params.room,
      host: PKURL,
      party: "chatprovider",

      onMessage: (evt: MessageEvent<Message>) => {
        console.log("new message from pk");
        const message = JSON.parse(evt.data);
        setMessages((prev) => [...prev, message]);
      },
    });

    async function send() {
      const data = methods.getValues();
      const message = params.message.parse(await onSubmit(data));
      ws.send(JSON.stringify(message));
    }

    return (
      <ChatContext.Provider value={{ messages, ws, send, formRef }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ChatContext.Provider>
    );
  }

  interface DivProps extends React.ComponentPropsWithoutRef<"div"> {
    scrollbar?: {
      barClassName?: string;
      thumbClassName?: string;
    };
    children: (message: Message, index: number) => React.ReactNode;
  }

  function Feed(props: DivProps) {
    const { messages } = useContext(ChatContext);
    const container = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const top = useRef<HTMLDivElement>(null);
    return (
      <ScrollArea.Root
        type="auto"
        className={cn("h-full overflow-hidden", props.className)}
      >
        <ScrollArea.Viewport
          className="flex h-full flex-col gap-2 py-4 pl-2 pr-5"
          ref={container}
        >
          <div {...props} className={cn("flex h-full flex-col gap-2 ")}>
            <div ref={top} />
            {messages.map((message, i) => {
              return props.children(message, i);
            })}
            <div ref={bottom} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className={cn(
            "h-full w-3 bg-white/30",
            props.scrollbar?.barClassName,
          )}
        >
          <ScrollArea.Thumb
            className={cn(
              "w-full rounded-full bg-gray-500",
              props.scrollbar?.thumbClassName,
            )}
          />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    );
  }

  interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

  function Input(props: InputProps) {
    const { send, formRef } = useContext(ChatContext);
    const { register, handleSubmit } = useFormContext();

    return (
      <form ref={formRef} onSubmit={handleSubmit(send)}>
        <input {...props} {...register("text")} />
      </form>
    );
  }

  interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}
  function Trigger(props: ButtonProps) {
    const { formRef } = useContext(ChatContext);
    return (
      <button
        type="button"
        {...props}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {props.children}
      </button>
    );
  }

  return { Root, Feed, Input, Trigger };
}
