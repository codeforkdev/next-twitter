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
  const [type, setType] = useState<"poll" | "post">("post");
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
      className="hidden gap-4   border-white/20 px-3 py-2 tablet:flex"
      onClick={() => type === "post" && inputRef.current?.focus()}
    >
      <Link
        href={"/" + user.handle}
        className="my-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar src={user.avatar} className=" h-10 w-10" />
      </Link>

      <div className="flex-1">
        {showAudienceSettings && type !== "poll" && (
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
            placeholder={
              type === "post" ? "What is happenings?!" : "Ask a question"
            }
            ref={inputRef}
            onInput={(e) => setText(e.currentTarget.value)}
            minRows={1}
            onFocus={() => setShowAudienceSettings(true)}
          />
          <div className="my-2" />

          {type === "poll" && (
            <>
              <PollForm close={() => setType("post")} />
              <Spacer className="my-2" />
            </>
          )}
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
        <div className="flex items-center gap-1 px-1 text-primary">
          <Option>
            <ImageIcon size={18} />
          </Option>
          <Option>
            <span className="rounded-sm border border-primary text-[8px] font-semibold">
              GIF
            </span>
          </Option>
          <Option onClick={() => setType("poll")}>
            <ListTodoIcon size={18} />
          </Option>
          <Option>
            <CalendarCheck2 size={18} />
          </Option>
          <Option>
            <MapPin size={18} />
          </Option>
          <div className="ml-auto flex items-center gap-4">
            {0 !== 0 && (
              <CircularProgressbar
                value={0}
                className=" h-6 w-6 stroke-white/30"
                styles={{
                  path: { stroke: "#1d9bf0" },
                }}
              />
            )}

            <button
              // onClick={handleSubmit}
              disabled={true}
              className=" rounded-full bg-primary px-4 py-1 font-semibold text-white disabled:bg-primary/70 disabled:text-white/70"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
interface OptionProps extends React.ComponentPropsWithoutRef<"button"> {}
const Option = (props: OptionProps) => {
  return (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick && props.onClick(e);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};
