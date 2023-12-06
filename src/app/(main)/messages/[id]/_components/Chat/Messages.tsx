"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import React, {
  Children,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TMessage } from "@/schemas";
import { ChatContext } from "./ChatProvider";
import { MessageSchema } from "@/server/party/chatprovider";

type Props = {
  id: string;
  userId: string;
  messages: TMessage[];
};

export default function Messages<T>({}: {
  children: (m: T) => React.ReactNode;
}) {
  const { messages } = useContext(ChatContext);

  return messages;
}
