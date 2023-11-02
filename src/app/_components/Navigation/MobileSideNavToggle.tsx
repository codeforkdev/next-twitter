"use client";
import * as Dialog from "@radix-ui/react-dialog";
import * as Seperator from "@radix-ui/react-separator";
import * as Accordion from "@radix-ui/react-accordion";
import { Avatar } from "../Avatar";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  User2Icon,
  LucideIcon,
  GanttChartSquareIcon,
  Users2Icon,
  BookmarkIcon,
  BanknoteIcon,
  ChevronDownIcon,
  BarChart2,
  MonitorPlayIcon,
  SettingsIcon,
  HelpCircleIcon,
  SaveIcon,
  BrushIcon,
  LogOutIcon,
} from "lucide-react";
import { Spacer } from "../Spacer";
import React, { useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { UserContext } from "@/app/(main)/UserProvider";
import { logout } from "@/actions/auth";

export default function MobileSideNavToggle() {
  const user = useContext(UserContext);
  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="flex-1  tablet:hidden" onClick={handleClick}>
            <Avatar src={user.avatar} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed  inset-0 z-50 bg-slate-500/30"
            />
          </Dialog.Overlay>

          <Dialog.Content className="fixed left-0 top-0 z-[999] h-[100dvh] w-3/4 ">
            <MobileSideNav user={user} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function MobileSideNav({ user }: { user: UserSchemaNoPassword }) {
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  return (
    <motion.nav
      initial={{ translateX: "-100%" }}
      animate={{ translateX: "0%" }}
      transition={{
        duration: 0.2,
        ease: "linear",
      }}
      className="h-full w-full overflow-y-auto border-r-4 border-gray-400/50 bg-black "
    >
      <div className="flex items-center justify-between p-4">
        <Avatar src={user.avatar ?? ""} className="h-10 w-10" />
        <Link
          href="/accounts/switch"
          className="h-fit w-fit grow-0 rounded-full border border-white/40 p-1.5"
        >
          <Plus size={20} />
        </Link>
      </div>
      <div className="px-4">
        <p className="text-lg font-semibold">{user.displayName}</p>
        <p className="text-sm text-white/40">@{user.handle}</p>
        <Spacer className="my-4" />
        <div className="flex gap-4 text-sm">
          <div className="flex gap-2">
            <span>85</span>
            <span className="text-white/40">Following</span>
          </div>
          <div className="flex gap-2">
            <span>47</span>
            <span className="text-white/40">Followers</span>
          </div>
        </div>
      </div>
      <Spacer className="my-6" />
      <ul>
        <NextLink href={"/" + user.handle} label="Profile" Icon={User2Icon} />
        <NextLink href="/i/verified-choose" label="Premium" Icon={User2Icon} />
        <NextLink href={"/lists"} label="Lists" Icon={GanttChartSquareIcon} />
        <NextLink href={"/bookmarks"} label="Bookmarks" Icon={BookmarkIcon} />
        <NextLink
          href={"/" + user.handle}
          label="Communities"
          Icon={Users2Icon}
        />
        <NextLink
          href={"/settings/monotezation"}
          label="Monotization"
          Icon={BanknoteIcon}
        />
      </ul>

      <Seperator.Root className="mx-4 my-2 h-[1px] bg-white/20" />

      <Accordion.Root
        type="multiple"
        onValueChange={(value) => {
          setOpenTabs(value);
        }}
      >
        <AccordionItem
          openTabs={openTabs}
          label="Creator Studio"
          value="creator"
        >
          <ul className="py-2">
            <li>
              <Link
                href="https://analytics.twitter.com/about"
                className="flex items-center gap-4 px-4 text-sm"
              >
                <BarChart2 size={20} />
                Analytics
              </Link>
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          openTabs={openTabs}
          label="Professional Tools"
          value="tools"
        >
          <ul className="py-2">
            <li>
              <Link
                href="https://ads.twitter.com/"
                className="flex items-center gap-4 px-4 text-sm"
              >
                <MonitorPlayIcon size={20} />
                Ads
              </Link>
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          openTabs={openTabs}
          label="Settings and Support"
          value="settings"
        >
          <ul className="flex flex-col gap-6 py-2">
            <li>
              <Link
                href="https://ads.twitter.com/"
                className="flex items-center gap-4 px-4 text-sm"
              >
                <SettingsIcon size={20} />
                Settings and privacy
              </Link>
            </li>
            <li>
              <Link
                href="https://ads.twitter.com/"
                className="flex items-center gap-4 px-4 text-sm"
              >
                <HelpCircleIcon size={20} />
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="https://ads.twitter.com/"
                className="flex items-center gap-4 px-4 text-sm"
              >
                <SaveIcon size={20} />
                Data saver
              </Link>
            </li>
            <li>
              <Link
                href="https://ads.twitter.com/"
                className="flex items-center gap-4 px-4 text-sm"
              >
                <BrushIcon size={20} />
                Display
              </Link>
            </li>
            <li>
              <button
                onClick={() => logout()}
                className="flex items-center gap-4 px-4 text-sm"
              >
                <LogOutIcon size={20} />
                Log out
              </button>
            </li>
          </ul>
        </AccordionItem>
      </Accordion.Root>
      <Spacer className="my-4" />
    </motion.nav>
  );
}

function AccordionItem({
  value,
  openTabs,
  children,
  label,
}: {
  value: string;
  label: string;
  openTabs: string[];
  children: React.ReactNode[] | React.ReactNode;
}) {
  const isOpen = openTabs.find((tab) => tab === value) ? true : false;
  useEffect(() => {
    console.log(openTabs);
  }, [openTabs]);
  return (
    <Accordion.Item value={value}>
      <Accordion.Trigger className="flex w-full justify-between px-4 py-3">
        <span className="text-sm font-semibold">{label}</span>
        <motion.span
          animate={{
            rotate: isOpen ? "-180deg" : "0deg",
            color: isOpen ? "#1d9bf0" : "white",
          }}
          transition={{
            ease: "linear",
            duration: 0.1,
          }}
        >
          <ChevronDownIcon size={20} />
        </motion.span>
      </Accordion.Trigger>
      <Accordion.Content>{children}</Accordion.Content>
    </Accordion.Item>
  );
}

function NextLink({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: LucideIcon;
  label: string;
}) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-6 px-4 py-3">
        {href === "/i/verified-choose" ? (
          <div className="relative h-[24px] w-[24px]">
            <Image src={"/logo.svg"} alt="logo" fill />
          </div>
        ) : (
          <Icon size={22} />
        )}
        <span className=" text-xl font-semibold">{label}</span>
      </Link>
    </li>
  );
}
