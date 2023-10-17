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
import { Avatar } from "../Avatar";

export function DesktopNavbar() {
  let cls = "py-1 group w-full flex  justify-center desktop:justify-start";
  return (
    <Container>
      <ul className="sticky left-0 top-0 flex h-full w-full flex-col items-center  pt-[.3px] tablet:items-center desktop:items-start">
        <Link
          href="/"
          className="w-fit rounded-full p-4 hover:bg-white/10 desktop:justify-start "
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
            <div className="flex gap-5 desktop:ml-3">
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
            <div className=" flex gap-5 desktop:ml-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 ">
                <MoreHorizontal size={18} />
              </div>
              <Label href={"/" + user.handle}>More</Label>
            </div>
          </LinkContent>
        </Link>
        <div className=" mt-4" />
        <button className="flex h-[52px] w-[50px] max-w-[232px] items-center justify-center rounded-full bg-primary py-[13.5px] text-[17px] font-semibold hover:bg-primary/90 desktop:w-full">
          <span className="hidden desktop:block">Post</span>
          <span className="desktop:hidden ">
            <Feather />
          </span>
        </button>

        <div className="mt-auto w-full ">
          <button className="flex w-full justify-center rounded-full p-3 hover:bg-white/10 desktop:justify-start desktop:p-4 desktop:pl-0">
            <div className="flex  items-center gap-2">
              <Avatar src={user.avatar} className="h-12 w-12 shrink-0" />
              <div className="hidden flex-col desktop:flex ">
                <div className="font-bold">{user.displayName}</div>
                <div className="text-sm text-white/50">@{user.handle}</div>
              </div>
              <div className="ml-auto hidden desktop:block">
                <MoreHorizontal size={20} />
              </div>
            </div>
          </button>
        </div>
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
        "sticky top-0 h-[100dvh] tablet:block",
        "border-r border-white/20",
        "desktop:w-[348px]",
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
    <div className="group relative  flex h-12 w-12 items-center justify-center rounded-full active:bg-white/10 tablet:hover:bg-white/10 desktop:hover:bg-white/0 desktop:hover:bg-none">
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
        "flex h-[50px] w-fit items-center gap-[10px] rounded-full bg-none pl-1 transition-colors desktop:pr-8 desktop:group-hover:bg-white/10",
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
      className={cn("hidden text-[19.5px] text-slate-100 desktop:block", {
        "font-semibold text-white": href === pathname,
      })}
    >
      {children}
    </span>
  );
};
