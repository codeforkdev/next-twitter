"use client";
import { useState } from "react";
import { PostForm } from "./PostForm";
import PollForm from "./PollForm";
import { CalendarCheck2, ImageIcon, ListTodoIcon, MapPin } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { cn } from "@/lib/utils";

export default function Forms() {
  const [type, setType] = useState<"poll" | "post">("post");
  return (
    <div>
      {type === "post" && <PostForm />}
      {type === "poll" && <PollForm close={() => setType("post")} />}
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
