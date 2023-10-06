"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Tab = ({
  active,
  href,
  children,
}: {
  active: boolean;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <li className="flex flex-col gap-2">
      <Link
        href={href}
        className={cn("text-gray-400", {
          "text-white font-semibold": active,
        })}
      >
        {children}
      </Link>
      <div
        className={cn("border-2 border-transparent", {
          "border-primary": active,
        })}
      />
    </li>
  );
};

export default function Tabs({ handle }: { handle: string }) {
  const pathname = usePathname();
  const base = "/" + handle;
  const isActive = (endpoint: string) => pathname.endsWith(endpoint);
  return (
    <ul className="flex justify-around border-b border-b-white/20">
      <Tab active={isActive("/" + handle)} href={base + "/"}>
        Posts
      </Tab>
      <Tab active={isActive("/replies")} href={base + "/replies"}>
        Replies
      </Tab>
      <Tab active={isActive("/highlights")} href={base + "/highlights"}>
        Highlights
      </Tab>
      <Tab active={isActive("/media")} href={base + "/media"}>
        Media
      </Tab>
      <Tab active={isActive("/likes")} href={base + "/likes"}>
        Likes
      </Tab>
    </ul>
  );
}
