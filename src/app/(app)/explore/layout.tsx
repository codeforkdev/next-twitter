"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { users } from "../../../drizzle/schema";
import { useDebounce } from "@/hooks/hooks";
import { user } from "@/mock/mock-data";
import Tabs from "./@components/Tabs";
import Search from "./@components/Search";
import Settings from "./@components/Settings";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { MainLayout } from "../home/layout";
import Slide from "../home/@components/Slide";
import Link from "next/link";
import { Users } from "./@components/Users";
import { searchUsers } from "@/actions/users";

type User = typeof users.$inferSelect;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout
      main={
        <>
          <Header />
          {children}
        </>
      }
      aside={<Aside />}
    />
  );
}

function Header() {
  const pathname = usePathname();
  const debounce = useDebounce();
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchList, setSearchList] = useState<User[]>([]);

  useEffect(() => {
    const cleanText = searchText.trim();
    if (!cleanText) {
      setSearching(false);
      debounce.cancel();
      return;
    }
    debounce.queue(async () => {
      const foundUsers = await searchUsers(cleanText);
      setSearchList(foundUsers);
      setSearching(true);
    });
  }, [searchText]);

  useEffect(() => {
    setSearching(false);
  }, [pathname]);

  const handleInputSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleanSearch = e.currentTarget.value.trim();
    if (!cleanSearch) debounce.cancel();
    setSearchText(e.currentTarget.value);
  };

  const handleBlur = () => {};

  const handleFocus = () => {
    setSearching(true);
  };

  return (
    <>
      <Slide height={-106} className="">
        <header
          className="flex h-[106px] flex-col justify-between border-b border-white/20 bg-black/60"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="flex items-center gap-6  px-4 py-3 ">
            {searching ? (
              <button onClick={() => setSearching(false)}>
                <ArrowLeft />
              </button>
            ) : (
              <Avatar src={user.avatar} />
            )}

            <Search
              onChange={handleInputSearchChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
            <Settings />
          </div>

          <Tabs />
        </header>
      </Slide>

      <Users show={searching} users={searchList} />
    </>
  );
}

function Aside() {
  return (
    <>
      <div className="relative">
        <Search onBlur={() => {}} onFocus={() => {}} onChange={() => {}} />
      </div>
      <div className="w-full rounded-xl bg-[#16181c] p-4">
        <p className="mb-2 text-xl font-bold">Subscribe to Premium</p>
        <p className="mb-3 text-sm font-semibold">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button className="rounded-full bg-primary px-4 py-1 font-semibold">
          Subscribe
        </button>
      </div>

      <div className="w-full rounded-xl bg-[#16181c] p-4">
        <p className="mb-2 text-xl font-bold">What's happening</p>
        <p className="mb-3 text-sm font-semibold">
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