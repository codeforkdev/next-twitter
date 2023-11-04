"use client";
import { BarChart2 } from "lucide-react";
import React, { useContext } from "react";
import { ReactionsContext, ReactionsContext } from "./Reactions";

export function ViewsButton() {
  const reactionsCtx = useContext(ReactionsContext);
  return (
    <div className="group flex items-center gap-2 rounded-full p-1.5 transition-colors">
      <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
        <BarChart2 size={18} />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
        {views}
      </div>
    </div>
  );
}
