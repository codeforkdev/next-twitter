"use client";
import { ChangeEvent, useContext } from "react";
import { ChatContext } from "./root";
import { cn } from "@/lib/utils";

export default function Input({ className }: { className: string }) {
  const ctx = useContext(ChatContext);
  return (
    <input
      className={cn(className)}
      onChange={(e) => ctx.updateText(e.currentTarget.value)}
      value={ctx.text}
    />
  );
}
