"use client";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellIcon,
  Bookmark,
  BookmarkIcon,
  Feather,
  GanttChartSquare,
  GanttChartSquareIcon,
  Home,
  HomeIcon,
  LucideIcon,
  Mail,
  MoreHorizontal,
  MoreHorizontalIcon,
  Search,
  SearchIcon,
  UserIcon,
  Users2,
  Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { Avatar } from "../Avatar";
import * as Popover from "@radix-ui/react-popover";
import { Spacer } from "../Spacer";
import { UserContext } from "@/app/(main)/UserProvider";

const UserMore = () => {
  const user = useContext(UserContext);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex w-full justify-center rounded-full p-3 hover:bg-white/10 desktop:justify-start">
          <div className="flex  w-full items-center gap-5">
            <Avatar src={user.avatar} className="h-10 w-10 shrink-0" />
            <div className="hidden flex-col items-start desktop:flex ">
              <div className="font-bold">{user.displayName}</div>
              <div className="text-sm text-white/50">@{user.handle}</div>
            </div>
            <div className="ml-auto hidden desktop:block">
              <MoreHorizontal size={20} />
            </div>
          </div>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-72 rounded-xl bg-black py-4"
          style={{
            boxShadow: "0px 0px 18px -6px rgba(255,255,255,0.75)",
          }}
        >
          <ul className="text-sm font-semibold">
            <li>
              <Link
                href="/logout"
                className="block px-6 py-4 text-left hover:bg-gray-500/10"
              >
                Logout of @{user.handle}
              </Link>
            </li>
          </ul>
          <Popover.Arrow className="fill-black" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const NavLink = (props: {
  url: string;
  label: string;
  icon: React.ReactNode;
}) => {
  let cls = "py-1 group w-full flex justify-center desktop:justify-start  ";
  const pathname = usePathname();
  const active = pathname.startsWith(props.url);
  return (
    <li className="group flex w-full justify-end ">
      <Link href={props.url} className={cls}>
        <div
          className={cn(
            "flex h-[50px] w-fit items-center gap-[10px] rounded-full bg-none pl-1 transition-colors desktop:pr-8 desktop:group-hover:bg-white/10",
          )}
        >
          {props.icon}
          <span
            className={cn("hidden text-[19.5px] text-slate-100 desktop:block", {
              "font-semibold text-white": active,
            })}
          >
            {props.label}
          </span>
        </div>
      </Link>
    </li>
  );
};

const ProfileLink = () => {
  const user = useContext(UserContext);
  return (
    <NavLink icon={<UserIcon />} label="Profile" url={`/${user.handle}`} />
  );
};

const Logo = () => {
  return (
    <div className="relative h-[26px] w-[26px]">
      <Image src={"/logo.svg"} alt="logo" fill />
    </div>
  );
};

export const DesktopNavbar = () => {
  return (
    <nav className="sticky top-0 hidden h-[100dvh] w-[100px] border-r border-white/20 tablet:block desktop:w-[348px]">
      <ul className="flex h-full w-full flex-col items-center pt-[.3px] tablet:items-center desktop:items-start">
        <NavLink label="" url="/home" icon={<Logo />} />
        <NavLink label="Home" url="/home" icon={<HomeIcon />} />
        <NavLink label="Explore" url="/explore" icon={<SearchIcon />} />
        <NavLink
          label="Notifications"
          url="/notifications"
          icon={<BellIcon />}
        />
        <NavLink label="Messages" url="/messages" icon={<Mail />} />
        <NavLink label="Lists" url="/lists" icon={<GanttChartSquareIcon />} />
        <NavLink label="Bookmarks" url="/bookmarks" icon={<BookmarkIcon />} />
        <NavLink label="Communities" url="/communities" icon={<Users2Icon />} />
        <NavLink label="Premium" icon={<Logo />} url="/premium" />
        <ProfileLink />
        <NavLink icon={<MoreHorizontalIcon />} label="More" url="/" />
        <Spacer className="py-2" />
        <NewPostButton />

        <Spacer className="mt-auto" />
        <div className="pb-2 desktop:w-full desktop:pr-2">
          <UserMore />
        </div>
        <Spacer className="p-1" />
      </ul>
    </nav>
  );
};

export const NewPostButton = () => {
  return (
    <button className="flex h-[52px] w-[50px] max-w-[232px] items-center justify-center rounded-full bg-primary py-[13.5px] text-[17px] font-semibold hover:bg-primary/90 desktop:w-full">
      <span className="hidden desktop:block">Post</span>
      <span className="desktop:hidden ">
        <Feather />
      </span>
    </button>
  );
};

const Icon = ({ Icon }: { Icon: LucideIcon }) => {
  return (
    <div className="group relative  flex h-12 w-12 items-center justify-center rounded-full active:bg-white/10 tablet:hover:bg-white/10 desktop:hover:bg-white/0 desktop:hover:bg-none">
      <Icon
        // size={active ? 30 : 24}
        className={cn("-mt-0.5", {
          // "fill-white stroke-black": active !== "/explore",
          // "stroke-3": href === "/explore",
        })}
      />
    </div>
  );
};
