"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
export default function Header() {
  const pathname = usePathname();
  return (
    <div>
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
      <section className="flex  border-b border-white/20">
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
    </div>
  );
}
