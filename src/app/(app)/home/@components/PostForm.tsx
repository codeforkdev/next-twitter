"use client";
import { Avatar } from "@/components/Avatar";
import {
  CalendarCheck2,
  ChevronDown,
  Globe2,
  ImageIcon,
  ListTodoIcon,
  MapPin,
} from "lucide-react";
import TextareaAutoSize from "../../[handle]/(post)/[postid]/TextArea";
import { user } from "@/mock/mock-data";
import { useEffect, useState } from "react";

import { submitPost } from "@/actions/posts";
import { CircularProgressbar } from "react-circular-progressbar";

const MAXTEXT = 500;
export function PostForm() {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true);

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
    <div className="hidden gap-4  border-b border-white/20 px-3 py-2 tablet:flex">
      <Avatar src={user.avatar} className="h-10 w-10" />

      <div className="flex-1">
        <button className=" flex w-fit items-center gap-[2px] rounded-full border border-blue-300/50 px-3 py-[1px] text-sm text-primary">
          <span className="font-semibold">Everyone</span>
          <ChevronDown size={17} />
        </button>
        <div className="my-5" />
        <TextareaAutoSize
          className="w-full resize-none bg-transparent text-xl outline-none placeholder:text-gray-400/70"
          placeholder="What is happenings?!"
          onInput={(e) => setText(e.currentTarget.value)}
          minRows={4}
        />
        <div className="my-2" />
        <div className="flex items-center gap-[4.75px] text-primary">
          <button className="flex items-center gap-2 text-[14px]">
            <Globe2 size={15} />
            <span>Everyone can reply</span>
          </button>
        </div>
        <div className="my-4 h-[1px] bg-white/20" />
        <div className="flex items-center gap-[18px] px-1 text-primary">
          <ImageIcon size={18} />
          <button className="rounded-sm border border-primary text-[8px] font-semibold">
            GIF
          </button>
          <ListTodoIcon size={20} />
          <CalendarCheck2 size={19} />
          <MapPin size={17} />
          <CircularProgressbar
            value={progress}
            className="ml-auto h-6 w-6 stroke-white/30"
            styles={{
              path: { stroke: "#1d9bf0" },
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className=" rounded-full bg-primary px-4 py-1 font-semibold text-white disabled:bg-primary/70"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
