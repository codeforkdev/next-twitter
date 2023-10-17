"use client";
import React, { useContext } from "react";
import { ChatContext } from "./root";
import { cn } from "@/lib/utils";

export default function Trigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(ChatContext);
  return (
    <button className={cn(className)} onClick={ctx.send}>
      {children}
    </button>
  );
}
