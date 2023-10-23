"use client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  BarChart2,
  BookmarkIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from "lucide-react";
import { user } from "@/mock/mock-data";
import { toggleBookmark, toggleLike } from "@/actions/actions";
import { users } from "@/drizzle/schema";
import { submitLike } from "@/actions/posts";
import usePartySocket from "partysocket/react";
import { useEffect, MouseEvent, useState } from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { Spacer } from "../Spacer";

type PostProps = {
  id: string;
  text: string;
  author: typeof users.$inferSelect;
  isBookmarked: boolean;
  comments: number;
  liked: boolean;
  likes: number;
};

export default function Post({
  id,
  author,
  text,
  isBookmarked,
  comments,
  likes,
}: PostProps) {
  const router = useRouter();
  const [totalLikes, setTotalLikes] = useState(likes);
  const liked = true;

  let party = usePartySocket({
    host: "http://localhost:1999",
    room: id,
    party: "post",
  });

  useEffect(() => {
    party.addEventListener("message", (evt) => {
      const { likes } = JSON.parse(evt.data);
      console.log("likes >>", likes);
      setTotalLikes(likes);
    });
  }, []);

  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    submitLike({ userId: user.id, postId: id });
  };
  return (
    <div
      onClick={() => router.push(`/${user.handle}/${id}`)}
      className=" flex cursor-pointer gap-3"
    >
      <Link
        href={"/" + author.handle}
        className="relative h-10 w-10 shrink-0 overflow-clip rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={
            author?.avatar ??
            "https://avatars.githubusercontent.com/u/142317935?v=4"
          }
        />
      </Link>
      <div className="flex-1">
        <header className="flex items-center gap-1">
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <Link
                href={"/" + author.handle}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <div className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold hover:underline">
                  {author.displayName}
                </div>
                <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-sm tracking-wide text-gray-400/70">
                  @{author.handle}
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
                  <Avatar src={author.avatar ?? ""} className="h-14 w-14" />
                  <button className="h-fit self-start rounded-full border border-white/20 px-4 py-1 font-semibold">
                    Following
                  </button>
                </div>
                <Spacer className="my-1" />
                <div>
                  <p className="font-semibold">{author.displayName}</p>
                  <p className="text-sm text-white/40">@{author.handle}</p>
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
          {text}
        </div>
        <div className="mt-2" />
        <div className="flex w-full justify-between gap-4 text-gray-500">
          <button
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
            onClick={handleLike}
          >
            <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
              <MessageCircle size={18} />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
              <div className="">{comments}</div>
            </div>
          </button>
          <button
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({ userId: user.id, postId: id, isBookmarked });
            }}
          >
            <div className="rounded-full p-1.5 group-hover:bg-emerald-500/20 group-hover:text-emerald-600 ">
              <Repeat2 size={20} />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-emerald-600">
              <div className=""></div>
            </div>
          </button>

          <button
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
            onClick={handleLike}
          >
            <div
              className={cn(
                "rounded-full p-1.5 group-hover:bg-pink-500/20 group-hover:text-pink-600 ",
              )}
            >
              <Heart
                size={18}
                className={cn("fill-pink-500 stroke-pink-500", liked)}
              />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-pink-600">
              <div className="">{likes !== 0 && likes}</div>
            </div>
          </button>

          <div
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
          >
            <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
              <BarChart2 size={18} />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
              <div className=""></div>
            </div>
          </div>

          <button
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
            onClick={handleLike}
          >
            <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
              <BookmarkIcon size={18} />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
              <div className=""></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
