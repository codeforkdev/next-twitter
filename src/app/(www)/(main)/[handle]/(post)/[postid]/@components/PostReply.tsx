"use client";
import { Avatar } from "@/app/_components/Avatar";
import TextareaAutoSize from "../TextArea";
import { Spacer } from "@/app/_components/Spacer";
import { useRef, useState, MouseEvent } from "react";
import { ImagePlus } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { submitReply } from "@/app/actions/posts";

export default function PostReply({
  postId,
  avatar,
  handle,
  userId,
}: {
  userId: string;
  avatar: string;
  postId: string;
  handle: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  const MAXTEXT = 500;

  const handleReply = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    submitReply({ userId, handle, text, postId });
    setText("");
  };
  return (
    <div
      onClick={() => {
        inputRef.current?.focus();
      }}
      ref={containerRef}
      className="-mx-4 border-b border-white/20 px-4 pb-4"
    >
      <div className=" flex gap-4 ">
        <Avatar src={avatar ?? ""} className="h-10 w-10 shrink-0" />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1">
            <TextareaAutoSize
              onClick={(e) => {
                e.stopPropagation();
              }}
              onInput={(e) => setText(e.currentTarget.value)}
              value={text}
              onFocus={() => {
                console.log("focused");
                setIsFocused(true);
              }}
              ref={inputRef}
              className="flex-1 resize-none bg-transparent py-2 text-xl outline-none"
              placeholder="Post your reply"
            />
          </div>
          {isFocused && (
            <>
              <Spacer className="my-2" />
              <div className="flex  w-full items-center gap-4">
                <button className="text-primary">
                  <ImagePlus size={18} />
                </button>

                <CircularProgressbar
                  value={(text.length / MAXTEXT) * 100}
                  className="ml-auto h-6 w-6 stroke-white/30"
                  styles={{
                    path: { stroke: "#1d9bf0" },
                  }}
                />
                <button
                  onClick={handleReply}
                  className="rounded-full bg-primary px-4 py-2 font-semibold"
                >
                  Reply
                </button>
              </div>
            </>
          )}
        </div>

        {!isFocused && (
          <div className="flex items-end">
            <button
              disabled={true}
              className="rounded-full bg-primary px-4 py-2 font-semibold disabled:bg-primary/70"
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
