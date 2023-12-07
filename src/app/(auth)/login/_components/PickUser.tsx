"use client";
import { login } from "@/actions/auth";
import { Avatar } from "@/app/_components/Avatar";
import { users } from "@/server/db/schema";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function PickUser({
  userList,
}: {
  userList: (typeof users.$inferSelect)[];
}) {
  return (
    <div className=" fixed left-1/2 top-1/2 h-[69%] w-full max-w-[37.5rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-black">
      <header className="relative flex items-center py-3">
        <Link
          href="/"
          className="absolute ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <XIcon size={20} />
        </Link>
        <Avatar src="/logo.svg" className="mx-auto h-7 w-7 rounded-none" />
      </header>

      <div className="p-4 text-3xl  font-semibold">Choose a demo user</div>
      {userList.map((user) => (
        <li
          key={user.id}
          className="flex gap-4 px-6 py-4 transition-all hover:bg-white/10"
        >
          <Avatar src={user.avatar} className="h-12 w-12" />
          <div className="">
            <p>{user.displayName}</p>
            <p>@{user.handle}</p>
          </div>
          <button
            // onClick={() => login({ userId: user.id })}
            className="ml-auto h-fit rounded-lg border border-primary px-4 py-2 text-primary transition-all hover:bg-primary hover:text-white"
          >
            Login
          </button>
        </li>
      ))}
    </div>
  );
}
