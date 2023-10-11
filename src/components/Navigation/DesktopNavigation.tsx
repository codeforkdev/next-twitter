"use client";
import { cn } from "@/lib/utils";
import { user } from "@/mock/mock-data";
import {
  Bell,
  Bookmark,
  Feather,
  GanttChartSquare,
  Home,
  LucideIcon,
  Mail,
  MoreHorizontal,
  Search,
  User,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function DesktopNavbar() {
  let cls = "py-1 group w-full flex  justify-center desktop:justify-start";
  return (
    <Container>
      <ul className="w-full items-center flex flex-col pt-[.3px] tablet:items-center desktop:items-start  sticky top-0 left-0">
        <Link
          href="/"
          className="w-full flex rounded-full p-4 justify-center desktop:justify-start hover:bg-white/10 "
        >
          <div className="relative h-[26px] w-[26px]">
            <Image src={"/logo.svg"} alt="logo" fill />
          </div>
        </Link>
        <Link href="/home" className={cls}>
          <LinkContent>
            <Icon Icon={Home} href="/home" />
            <Label href="/home">Home</Label>
          </LinkContent>
        </Link>
        <Link href="/explore" className={cls}>
          <LinkContent>
            <Icon Icon={Search} href="/explore" />
            <Label href="/explore">Explore</Label>
          </LinkContent>
        </Link>
        <Link href="/notifications" className={cls}>
          <LinkContent>
            <Icon Icon={Bell} href="/notifications" />
            <Label href="/notifications">Notifications</Label>
          </LinkContent>
        </Link>
        <Link href="/messages" className={cls}>
          <LinkContent>
            <Icon Icon={Mail} href="/messages" />
            <Label href="/messages">Messages</Label>
          </LinkContent>
        </Link>
        <Link href="/lists" className={cls}>
          <LinkContent>
            <Icon Icon={GanttChartSquare} href="/lists" />
            <Label href="/lists">Lists</Label>
          </LinkContent>
        </Link>
        <Link href="/bookmarks" className={cls}>
          <LinkContent>
            <Icon Icon={Bookmark} href="/bookmarks" />
            <Label href="/bookmarks">Bookmarks</Label>
          </LinkContent>
        </Link>
        <Link href="/communities" className={cls}>
          <LinkContent>
            <Icon Icon={Users2} href="/communities" />
            <Label href="/communities">Communities</Label>
          </LinkContent>
        </Link>
        <Link href="/premium" className={cls}>
          <LinkContent>
            <div className="flex desktop:ml-3 gap-5">
              <div className="relative h-6 w-6">
                <Image src={"/logo.svg"} alt="logo" fill />
              </div>

              <Label href="/premium">Premium</Label>
            </div>
          </LinkContent>
        </Link>
        <Link href={"/" + user.handle} className={cls}>
          <LinkContent>
            <Icon Icon={User} href={"/" + user.handle} />
            <Label href={"/" + user.handle}>Profile</Label>
          </LinkContent>
        </Link>
        <Link href={"/" + user.handle} className={cls}>
          <LinkContent>
            <div className=" flex desktop:ml-3 gap-5">
              <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center ">
                <MoreHorizontal size={18} />
              </div>
              <Label href={"/" + user.handle}>More</Label>
            </div>
          </LinkContent>
        </Link>
        <div className="mt-4" />
        <button className="py-[13.5px] hover:bg-white/10 rounded-full text-[17px] h-[52px] w-[50px] flex items-center justify-center desktop:w-full bg-primary max-w-[232px] font-semibold">
          <span className="hidden desktop:block">Post</span>
          <span className="desktop:hidden ">
            <Feather />
          </span>
        </button>
      </ul>
    </Container>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav
      className={cn(
        // "border-8 border-green-500",
        "hidden w-[100px] ",
        "tablet:block h-[100dvh] sticky top-0",
        "border-r border-white/20",
        "desktop:w-[348px]"
      )}
    >
      {children}
    </nav>
  );
};

const Icon = ({ Icon, href }: { Icon: LucideIcon; href: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <div className="relative group  tablet:hover:bg-white/10 active:bg-white/10 desktop:hover:bg-white/0 h-12 w-12 flex items-center justify-center rounded-full desktop:hover:bg-none">
      <Icon
        size={active ? 30 : 24}
        className={cn("-mt-0.5", {
          "fill-white stroke-black": active && href !== "/explore",
          "stroke-3": href === "/explore",
        })}
      />
    </div>
  );
};

const LinkContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex gap-[10px] w-fit bg-none desktop:group-hover:bg-white/10 transition-colors rounded-full desktop:pr-8 pl-1 items-center h-[50px]"
      )}
    >
      {children}
    </div>
  );
};

const Label = ({
  children,
  href,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <span
      className={cn("hidden desktop:block text-slate-100 text-[19.5px]", {
        "font-semibold text-white": href === pathname,
      })}
    >
      {children}
    </span>
  );
};
