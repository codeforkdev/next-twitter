"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Tab({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className="flex h-full flex-1 items-center justify-center transition-colors hover:bg-white/10"
    >
      <div className="flex h-full flex-col justify-end ">
        <p
          className={cn(
            "mb-2  flex text-center text-[15px] font-semibold tracking-wide text-gray-500",
            {
              "text-white": active,
            },
          )}
        >
          {children}
        </p>
        <div
          className={cn("h-1 rounded-full bg-transparent", {
            "bg-primary": active,
          })}
        />
      </div>
    </Link>
  );
}
