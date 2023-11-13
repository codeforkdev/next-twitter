"use client";
import { MouseEvent } from "react";
import { Avatar } from "@/app/_components/Avatar";
import {
  CalendarCheck2,
  ChevronDown,
  Globe2,
  ImageIcon,
  ListTodoIcon,
  MapPin,
  PlusIcon,
} from "lucide-react";
import TextareaAutoSize from "../../[handle]/(post)/[postid]/TextArea";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Spacer } from "@/app/_components/Spacer";
import Link from "next/link";
import { UserContext } from "../../UserProvider";
import { submitPost } from "@/actions/actions";
import { cn } from "@/lib/utils";
import { Input } from "@/app/(auth)/login/_components/CredentialAuth";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import PollForm from "./PollForm";

const MAXTEXT = 500;
export function PostForm() {
  const user = useContext(UserContext);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [showAudienceSettings, setShowAudienceSettings] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    await submitPost({ userId: user.id, text });
  };

  useEffect(() => {
    text.length === 0 || text.length > MAXTEXT
      ? setDisabled(true)
      : setDisabled(false);

    setProgress((text.length / MAXTEXT) * 100);
  }, [text]);
  return (
    <div
      className="hidden gap-4  border-b border-white/20 px-3 py-2 tablet:flex"
      onClick={() => inputRef.current?.focus()}
    >
      <Link
        href={"/" + user.handle}
        className="my-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar src={user.avatar} className=" h-10 w-10" />
      </Link>

      <div className="flex-1">
        {showAudienceSettings && (
          <>
            <button className=" flex w-fit items-center gap-[2px] rounded-full border border-blue-300/50 px-3 py-[1px] text-sm text-primary">
              <span className="font-semibold">Everyone</span>
              <ChevronDown size={17} />
            </button>

            <Spacer className="py-1" />
          </>
        )}

        <Spacer className="my-4" />
        <div>
          <TextareaAutoSize
            className="min-h-[45px] w-full resize-none bg-transparent text-xl outline-none placeholder:text-gray-400/70"
            placeholder="What is happenings?!"
            ref={inputRef}
            onInput={(e) => setText(e.currentTarget.value)}
            minRows={1}
            onFocus={() => setShowAudienceSettings(true)}
          />
          <div className="my-2" />
          {showAudienceSettings && (
            <>
              <div className="flex items-center gap-[4.75px] text-primary">
                <button className="flex items-center gap-2 text-[14px]">
                  <Globe2 size={15} />
                  <span>Everyone can reply</span>
                </button>
              </div>
              <div className="my-3 h-[1px] bg-white/20" />
            </>
          )}
        </div>
        {/* OPTIONS */}
      </div>
    </div>
  );
}
