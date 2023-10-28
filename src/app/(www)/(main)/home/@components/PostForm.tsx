"use client";
import { Avatar } from "@/app/_components/Avatar";
import {
  CalendarCheck2,
  ChevronDown,
  Globe2,
  ImageIcon,
  ListTodoIcon,
  MapPin,
} from "lucide-react";
import TextareaAutoSize from "../../[handle]/(post)/[postid]/TextArea";
import { useContext, useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Spacer } from "@/app/_components/Spacer";
import Link from "next/link";
import { submitPost } from "@/app/actions/actions";
import { UserContext } from "../../UserProvider";

const MAXTEXT = 500;
export function PostForm() {
  const user = useContext(UserContext);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [showAudienceSettings, setShowAudienceSettings] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    console.log("clicked");
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
        <TextareaAutoSize
          className="w-full resize-none bg-transparent text-xl outline-none placeholder:text-gray-400/70"
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
        <div className="flex items-center gap-[18px] px-1 text-primary">
          <ImageIcon size={18} />
          <button className="rounded-sm border border-primary text-[8px] font-semibold">
            GIF
          </button>
          <ListTodoIcon size={20} />
          <CalendarCheck2 size={19} />
          <MapPin size={17} />
          <div className="ml-auto flex items-center gap-4">
            {progress !== 0 && (
              <CircularProgressbar
                value={progress}
                className=" h-6 w-6 stroke-white/30"
                styles={{
                  path: { stroke: "#1d9bf0" },
                }}
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={disabled}
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
