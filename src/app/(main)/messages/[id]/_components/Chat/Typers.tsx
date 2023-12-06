"use client";
import { useContext } from "react";
import { ChatContext } from "./ChatProvider";
import { Avatar } from "@/app/_components/Avatar";

export default function Typers() {
  const { typers } = useContext(ChatContext);
  return (
    <>
      {typers.map((typer) => (
        <span key={typer.connId}>
          <Avatar src={typer.avatar} />
        </span>
      ))}
    </>
  );
}
