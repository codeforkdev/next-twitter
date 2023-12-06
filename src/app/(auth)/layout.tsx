import { Avatar } from "@/app/_components/Avatar";
import React from "react";
import { Spacer } from "../_components/Spacer";
import Link from "next/link";
import { ArrowLeft, ArrowLeftIcon, StepBackIcon, XIcon } from "lucide-react";
import * as Toast from "./Toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider swipeDirection="down">
      <div className="fixed inset-0 h-full bg-[#242d34]" />
      <Avatar className="fixed left-10 top-10 rounded-none" src="/logo.svg" />

      <div className=" fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 bg-black laptop:block laptop:h-[80%]  laptop:max-w-[37.5rem] laptop:rounded-2xl">
        <div className="flex h-full  w-full flex-col">
          <header className="relative flex h-32 flex-col  p-3 px-6">
            {/* <div>
              <Link
                href="/"
                className="fixed left-10 top-10 rounded-full p-2 transition-colors hover:bg-white/10 laptop:absolute laptop:left-4 laptop:top-2 "
              >
                <ArrowLeftIcon />
              </Link>
            </div> */}

            <Avatar
              src="/logo.svg"
              className=" my-auto h-12 w-12 rounded-none tablet:mx-auto "
            />

            <div />
          </header>
          {/* <Spacer className="my-5" /> */}
          {/* <div className=" mx-auto max-w-[19rem]"> */}
          <div className=" flex-1">{children}</div>
        </div>
      </div>

      <Toast.Viewport className="fixed bottom-14 left-1/2 -translate-x-1/2" />
    </Toast.Provider>
  );
}
