"use client";
import { FormEvent, useContext, useRef } from "react";
import { ChatContext } from "./ChatProvider";
import { cn } from "@/lib/utils";

type InputProps = React.ButtonHTMLAttributes<HTMLInputElement> & {
  typingTimeout: number;
};

export default function Input(props: InputProps) {
  const { typingTimeout, ...inputProps } = props;
  const isTyping = useRef<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const { sendMessage, send, inputRef, typing } = useContext(ChatContext);

  const handleEnter = () => {
    sendMessage();
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      if (!isTyping.current) {
        isTyping.current = true;
        typing.start();
        timeoutIdRef.current = setTimeout(
          () => typing.stop(),
          props.typingTimeout,
        );
        return;
      }

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(
          () => typing.stop(),
          props.typingTimeout,
        );
      }
    }
  };

  return (
    <input
      {...inputProps}
      className={cn(props.className)}
      ref={inputRef}
      onInput={handleInput}
      onKeyUp={(e) => e.key === "Enter" && handleEnter()}
    />
  );
}
