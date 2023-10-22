"use client";

import { searchUsers } from "@/actions/users";
import { Avatar } from "@/components/Avatar";
import { ScrollInView } from "@/components/ScrollInView";
import { useDebounce } from "@/hooks/hooks";
import { user } from "@/mock/mock-data";
import { ArrowLeft, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Tabs from "./Tabs";
import { User } from "@/types";
import { Users } from "./Users";
import Search from "./Search";

export function Header({ user }: { user: User }) {
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
      <ScrollInView top={-106} className="">
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
      </ScrollInView>

      <Users show={searching} users={searchList} />
    </>
  );
}
