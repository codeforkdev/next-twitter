"use client";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { Avatar } from "@/app/_components/Avatar";
import * as Toast from "@radix-ui/react-toast";
import { Spacer } from "@/app/_components/Spacer";
import NameAndPasswordAuth from "./_components/CredentialAuth";

export default function Page() {
  // const users = await api.users.listUsers.query();
  return (
    <Toast.Provider swipeDirection="down">
      <div className=" fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-y-auto bg-black laptop:block laptop:h-[69%]  laptop:max-w-[37.5rem] laptop:rounded-2xl">
        <div className="w-full">
          <header className="relative flex items-center py-3">
            <Link
              href="/"
              className="fixed left-0 top-2 ml-2  rounded-full p-2 transition-colors hover:bg-white/10 laptop:absolute"
            >
              <XIcon size={20} />
            </Link>
            <Avatar src="/logo.svg" className="mx-auto h-7 w-7 rounded-none" />
            <div />
          </header>
          <Spacer className="my-5" />
          <div className=" mx-auto max-w-[19rem]">
            <p className="text-3xl font-semibold">Sign into X</p>
            <Spacer className="my-8" />
            <button className="w-full rounded-full bg-primary py-2 font-semibold text-white transition-colors hover:bg-primary/90">
              Demo Account
            </button>

            <div className="my-4 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-gray-300/50" />
              <div>or</div>
              <div className="h-[1px] flex-1 bg-gray-300/50" />
            </div>
            <NameAndPasswordAuth />
            <Spacer className="my-6" />
            <button className="w-full rounded-full border border-gray-600 bg-transparent py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-300/10">
              Forgot password ?
            </button>

            <Spacer className="py-2" />
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* <PickUser userList={users} /> */}
      <Toast.Viewport className="fixed bottom-14 left-1/2 -translate-x-1/2" />
    </Toast.Provider>
  );
}
