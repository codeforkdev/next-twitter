"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Search from "../explore/@components/Search";
import Slide from "./@components/Slide";
import { usePathname } from "next/navigation";
import { user } from "@/mock/mock-data";
import TextareaAutoSize from "react-textarea-autosize";
import {
  CalendarCheck2,
  ChevronDown,
  Globe2,
  ImageIcon,
  ListTodoIcon,
  MapPin,
} from "lucide-react";

export const Thing = ({
  header,
  page,
  aside,
}: {
  header: React.ReactNode;
  page: React.ReactNode;
  aside: React.ReactNode;
}) => {
  return (
    <div className="w-full flex ">
      <main className="max-w-[600px] shrink-0 w-full border-r border-white/20">
        {header}
        {page}
      </main>

      <aside className="hidden h-screen  sticky flex-1 top-0 py-3 px-5 laptop:flex flex-col gap-3">
        {aside}
      </aside>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Thing header={<Header />} page={children} aside={<Aside />} />;
}

function Header() {
  const pathname = usePathname();
  return (
    <>
      <Slide
        height={-106}
        className="sticky w-full  shrink-0 flex flex-col justify-between z-10"
      >
        <header className="border-b h-[106px] border-white/20 flex flex-col justify-between">
          <section className="flex">
            {/* Desktop title */}
            <h1 className="hidden font-semibold text-xl text-gray-100">Home</h1>

            {/* Profile Avatar */}
            <div className="flex-1 pl-4 pt-[10px]">
              <div className="h-8 w-8 rounded-full overflow-clip relative ">
                <Image
                  src="https://avatars.githubusercontent.com/u/142317935?v=4"
                  alt=""
                  fill
                />
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center -ml-4 mt-4">
              <div className="relative h-[20px] w-[20px]">
                <Image src={"/logo.svg"} alt="logo" fill />
              </div>
            </div>

            {/* Buffer to center logo */}
            <div className="flex-1" />
          </section>

          {/* Tabs */}
          <section className="flex">
            <Link
              href="/home"
              className="flex-1 h-full flex items-center justify-center "
            >
              <div className="h-full flex flex-col justify-end ">
                <p
                  className={cn(
                    "text-center  text-[15px] tracking-wide flex mb-3 text-gray-500 font-semibold",
                    {
                      "text-white": pathname === "/home",
                    }
                  )}
                >
                  For you
                </p>
                <div
                  className={cn("bg-transparent h-1 rounded-full", {
                    "bg-primary": pathname === "/home",
                  })}
                />
              </div>
            </Link>
            <Link
              href="/home/following"
              className="flex-1 h-full flex items-center justify-center "
            >
              <div className="h-full flex flex-col justify-end ">
                <p
                  className={cn(
                    "text-center  text-[15px] tracking-wide flex mb-3 text-gray-500 font-semibold",
                    {
                      "text-white": pathname === "/home/following",
                    }
                  )}
                >
                  Following
                </p>
                <div
                  className={cn("bg-transparent h-1 rounded-full", {
                    "bg-primary": pathname === "/home/following",
                  })}
                />
              </div>
            </Link>
          </section>
        </header>
      </Slide>

      <div className="hidden tablet:flex min-h-[16rem] px-3 py-2 gap-4 border-b border-white/20">
        <Avatar src={user.avatar} className="h-12 w-12" />
        <div className="flex-1">
          <button className=" text-primary text-sm border border-blue-300/50 rounded-full px-3 py-[1px] flex items-center gap-[2px] w-fit">
            <span className="font-semibold">Everyone</span>
            <ChevronDown size={17} />
          </button>
          <div className="my-5" />
          <TextareaAutoSize
            className="w-full bg-transparent text-xl placeholder:text-gray-400/70 resize-none"
            placeholder="What is happenings?!"
            minRows={4}
          />
          <div className="my-2" />
          <div className="flex gap-[4.75px] text-primary items-center">
            <button className="text-[14px] flex items-center gap-2">
              <Globe2 size={15} />
              <span>Everyone can reply</span>
            </button>
          </div>
          <div className="h-[1px] bg-white/20 my-4" />
          <div className="flex gap-[18px] items-center text-primary px-1">
            <ImageIcon size={18} />
            <button className="text-[8px] border border-primary rounded-sm font-semibold">
              GIF
            </button>
            <ListTodoIcon size={20} />
            <CalendarCheck2 size={19} />
            <MapPin size={17} />
            <button className="py-1 px-4 bg-primary/70 rounded-full font-semibold text-white ml-auto">
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-white/20 text-primary py-[12px] text-center">
        Show 385 posts
      </div>
    </>
  );
}
const Avatar = ({ src, className }: { src: string; className: string }) => {
  return (
    <div className={cn(" rounded-full overflow-clip relative ", className)}>
      <Image src={src} alt="avatar" fill />
    </div>
  );
};

function Aside() {
  return (
    <>
      <div className="relative">
        <Search onBlur={() => {}} onFocus={() => {}} onChange={() => {}} />
      </div>
      <div className="w-full bg-[#16181c] p-4 rounded-xl">
        <p className="text-xl font-bold mb-2">Subscribe to Premium</p>
        <p className="mb-3 font-semibold text-sm">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button className="bg-primary font-semibold py-1 px-4 rounded-full">
          Subscribe
        </button>
      </div>

      <div className="w-full bg-[#16181c] p-4 rounded-xl">
        <p className="text-xl font-bold mb-2">What's happening</p>
        <p className="mb-3 font-semibold text-sm">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <Link href="/explore" className="text-primary">
          show more
        </Link>
      </div>
    </>
  );
}
