"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { user } from "@/mock-data";
import Link from "next/link";
import {
  Home,
  Search,
  Bell,
  Mail,
  GanttChartSquare,
  Bookmark,
  Users2,
  Feather,
  LucideIcon,
  MoreHorizontal,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useVelocity,
} from "framer-motion";
import { useState } from "react";

export function DesktopNavigation() {
  let cls = "py-1 group w-full flex justify-center desktop:justify-start";
  return (
    <nav className="hidden min-w-[69px] tablet:flex desktop:w-[275px] h-full flex-col border-r border-r-white/20 sticky top-0 border">
      <ul className="flex flex-col items-center desktop:items-start pl-1">
        <Link
          href="/"
          className="w-fit rounded-full p-4 hover:bg-white/10 ml-2 desktop:ml-0"
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
        <div className="mt-5" />
        <button className="py-[13.5px] hover:bg-white/10 rounded-full text-[17px] h-[52px] w-[52px] flex items-center justify-center desktop:w-full bg-primary max-w-[232px] font-semibold">
          <span className="hidden desktop:block">Post</span>
          <span className="desktop:hidden ">
            <Feather />
          </span>
        </button>
      </ul>
    </nav>
  );
}

export function MobileNavigation() {
  const { scrollY } = useScroll();
  const [y, setY] = useState(scrollY.get());
  const [show, setShow] = useState(y === 0 ? true : false);
  const scrollVelocity = useVelocity(scrollY);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest === 0) {
      setShow(true);
      return;
    }
    if (latest < y) {
      console.log("scrolling up", scrollVelocity.get());
      if (scrollVelocity.get() < -3200) {
        setShow(true);
      }
    } else {
      setShow(false);
      console.log("scrolling down", scrollVelocity.get());
    }
    setY(latest);
  });
  console.log("dim", !show);

  return (
    <>
      <motion.button
        animate={show ? "bright" : "dim"}
        variants={{
          dim: {
            opacity: 0.4,
          },
          bright: {
            opacity: 1,
          },
        }}
        className="h-14 w-14 bg-primary flex justify-center items-center  rounded-full fixed bottom-[74px] right-5"
      >
        <Feather size={26} />
      </motion.button>
      <motion.nav
        animate={show ? "bright" : "dim"}
        variants={{
          dim: {
            opacity: 0.4,
          },
          bright: {
            opacity: 1,
          },
        }}
        className="h-[53px] border-t border-t-slate-700 tablet:hidden fixed bottom-0 left-0 w-full bg-black"
      >
        <ul className="flex justify-evenly gap-8 items-center h-full max-w-[352px] mx-auto">
          <Link href="/home">
            <Icon Icon={Home} href="/home" />
          </Link>
          <Link href="/explore">
            <Icon Icon={Search} href="/explore" />
          </Link>
          <Link href="/notifications">
            <Icon Icon={Bell} href="/notifications" />
          </Link>
          <Link href={"/messages"}>
            <Icon Icon={Mail} href="/messages" />
          </Link>
        </ul>
      </motion.nav>
    </>
  );
}

const Icon = ({ Icon, href }: { Icon: LucideIcon; href: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <div className="relative group tablet:hover:bg-white/10 active:bg-white/10 desktop:hover:bg-white/0 h-12 w-12 flex items-center justify-center rounded-full desktop:hover:bg-none">
      <Icon
        size={active ? 30 : 25}
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
        "flex gap-2 w-fit bg-none desktop:group-hover:bg-white/10 transition-colors rounded-full desktop:pr-8 pl-1 items-center h-[50px]"
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
      className={cn("hidden desktop:block text-slate-100 text-[19px]", {
        "font-semibold text-white": href === pathname,
      })}
    >
      {children}
    </span>
  );
};
