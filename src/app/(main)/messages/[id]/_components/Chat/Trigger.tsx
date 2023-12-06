"use client";
import React, { useContext } from "react";
import { ChatContext } from "./ChatProvider";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
export default function Trigger(props: Props) {
  const { sendMessage } = useContext(ChatContext);
  return (
    <button
      {...props}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        sendMessage();
      }}
    ></button>
  );
}
