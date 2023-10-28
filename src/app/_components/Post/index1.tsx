"use client";
import { useRouter } from "next/navigation";
import * as HoverCard from "@radix-ui/react-hover-card";
import { MoreHorizontal } from "lucide-react";
import usePartySocket from "partysocket/react";
import { useEffect, MouseEvent, useState } from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { Spacer } from "../Spacer";
import { Reactions } from "./Reactions";

type PostProps = {
  id: string;
  text: string;
  authorId: string;
  postCreatedAt: string;
  handle: string;
  avatar: string;
  displayName: string;
  joinedAt: string;
  bookmarked: boolean;
  comments: number;
  liked: boolean;
  likes: number;
  views: number;
};

export default function Post(props: PostProps) {
  const router = useRouter();
  const [totalLikes, setTotalLikes] = useState(props.likes);
  const [totalComments, setTotalComments] = useState(props.comments);

  let party = usePartySocket({
    host: "http://localhost:1999",
    room: props.id,
    party: "post",
  });

  useEffect(() => {
    party.addEventListener("message", (evt) => {
      const payload = JSON.parse(evt.data);
      switch (payload.type) {
        case "like":
          setTotalLikes(payload.data.likes);
          break;
        case "comment":
          setTotalComments(payload.data.comments);
          break;
      }
    });
  }, []);

  const handleBookmark = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("handle bookmark");
    // submitBookmark({ userId, postId: id, isBookmarked: bookmarked });
  };
  return (
    <div
      onClick={() => router.push(`/${props.handle}/${props.id}`)}
      className=" flex cursor-pointer gap-3"
    >
      <Link
        href={"/" + props.handle}
        className="relative h-10 w-10 shrink-0 overflow-clip rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={
            props?.avatar ??
            "https://avatars.githubusercontent.com/u/142317935?v=4"
          }
        />
      </Link>
      <div className="flex-1">
        <header className="flex items-center gap-1">
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <Link
                href={"/" + props.handle}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <div className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold hover:underline">
                  {props.displayName}
                </div>
                <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-sm tracking-wide text-gray-400/70">
                  @{props.handle}
                </span>
              </Link>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content
                style={{
                  boxShadow: "0px 0px 18px -6px rgba(255,255,255,0.75)",
                }}
                className="mt-3  w-[300px] rounded-xl bg-black p-4"
              >
                <div className="flex justify-between ">
                  <Avatar src={props.avatar ?? ""} className="h-14 w-14" />
                  <button className="h-fit self-start rounded-full border border-white/20 px-4 py-1 font-semibold">
                    Following
                  </button>
                </div>
                <Spacer className="my-1" />
                <div>
                  <p className="font-semibold">{props.displayName}</p>
                  <p className="text-sm text-white/40">@{props.handle}</p>
                </div>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>

          <span className="text-gray-400">·</span>
          <span className="text-sm text-gray-400">20h</span>
          <button className="ml-auto">
            <MoreHorizontal size={18} className="text-gray-400" />
          </button>
        </header>

        <div className="max-w-full grow-0 break-words text-gray-200">
          {props.text}
        </div>
        <div className="mt-2" />
        {/* Interactions bar */}
        <Reactions
          bookmarked={true}
          comments={1}
          liked={true}
          likes={10}
          reposts={10}
        />
      </div>
    </div>
  );
}
