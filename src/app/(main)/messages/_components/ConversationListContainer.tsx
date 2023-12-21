"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { lazy, useEffect, useState } from "react";

const useWindowSize = () => {
  const [broswer, setBroswer] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (width < 1000) console.log("less than 1000px");
  }, [width]);

  useEffect(() => {
    if (!broswer) {
      setBroswer(true);
      return;
    }
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [broswer]);

  return { width };
};

export default function ConversationDynamicWindowLayout({
  list,
  conversation,
}: {
  list: React.ReactNode;
  conversation: React.ReactNode;
}) {
  const pathname = usePathname();
  const { width } = useWindowSize();
  return (
    <div className={cn("flex w-full")}>
      <div
        className={cn("w-full border-x border-white/20 laptop:w-[390px]", {
          hidden: !pathname.endsWith("/messages") && width < 1000,
        })}
      >
        {list}
      </div>
      <div
        className={cn("flex-1 border-4 border-purple-500", {
          hidden: width < 1000 && pathname.endsWith("/messages"),
        })}
      >
        {conversation}
      </div>
    </div>
  );
}
