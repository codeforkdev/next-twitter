"use client";
import { login } from "@/actions/auth";
import { Avatar } from "@/components/Avatar";
import { users } from "@/drizzle/schema";
import * as Dialog from "@radix-ui/react-dialog";

export default function PickUser({
  userList,
}: {
  userList: (typeof users.$inferSelect)[];
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-full rounded-full border border-white/20 py-2 text-center text-primary">
          Sign in
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-white/30"
          style={{ backdropFilter: "blur(5px)" }}
        />
        <Dialog.Content className=" fixed left-1/2 top-1/2 h-[75%] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-black">
          <Dialog.Title className="p-4 text-3xl  font-semibold">
            Choose a demo user
          </Dialog.Title>
          {userList.map((user) => (
            <li className="flex gap-4 px-6 py-4 transition-all hover:bg-white/10">
              <Avatar src={user.avatar} className="h-12 w-12" />
              <div className="">
                <p>{user.displayName}</p>
                <p>@{user.handle}</p>
              </div>
              <button
                onClick={() => login({ userId: user.id })}
                className="ml-auto h-fit rounded-lg border border-primary px-4 py-2 text-primary transition-all hover:bg-primary hover:text-white"
              >
                Login
              </button>
            </li>
          ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
