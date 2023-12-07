import { Avatar } from "@/app/_components/Avatar";
import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import * as Toast from "./Toast";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) redirect("/home");
  return (
    <>
      <div className="fixed inset-0 h-full bg-[#242d34]" />
      <Avatar className="fixed left-10 top-10 rounded-none" src="/logo.svg" />

      <div className="fixed left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col bg-black p-8 laptop:block laptop:max-h-[80%]  laptop:max-w-[37.5rem] laptop:rounded-2xl">
        <header className="relative flex h-24 flex-col">
          <div>
            <Link
              href="/"
              className="fixed rounded-full  transition-colors hover:bg-white/10 laptop:absolute laptop:left-4 laptop:top-2 "
            >
              <ArrowLeftIcon />
            </Link>
          </div>

          <Avatar src="/logo.svg" className=" mx-auto  h-8 w-8 rounded-none " />

          <div />
        </header>
        {/* <Spacer className="my-5" /> */}
        {/* <div className=" mx-auto max-w-[19rem]"> */}
        <div className=" flex-1">{children}</div>
      </div>

      <Toast.Viewport className="fixed bottom-14 left-1/2 -translate-x-1/2" />
    </>
  );
}
