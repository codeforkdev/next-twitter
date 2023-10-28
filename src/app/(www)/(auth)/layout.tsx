import { Avatar } from "@/app/_components/Avatar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Avatar className="fixed left-10 top-10 rounded-none" src="/logo.svg" />
      <div className="h-full bg-[#242d34] px-4" tabIndex={1}>
        {children}
      </div>
    </>
  );
}
