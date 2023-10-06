"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ScrollInView } from "@/components/ScrollInView";
import { users } from "@/drizzle/schema";
import { useDebounce } from "@/hooks/hooks";
import { searchUsers } from "@/actions/actions";
import { user } from "@/mock/mock-data";
import { Users } from "./@components/Users";
import Tabs from "./@components/Tabs";
import Search from "./@components/Search";
import Settings from "./@components/Settings";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/Avatar";

type User = typeof users.$inferSelect;

export default function Layout({ children }: { children: React.ReactNode }) {
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
      <ScrollInView top={-106} className="sticky z-10">
        <header
          className="h-[106px] bg-black/60 border-b border-white/20 flex flex-col justify-between"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="flex items-center gap-6  py-3 px-4 ">
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
      </ScrollInView>
      {!searching && children}

      <Users show={searching} users={searchList} />
    </>
  );
}
