"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  BarChart2,
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

type PostProps = {
  id: string;
  text: string;
  author: typeof users.$inferSelect;
  isBookmarked: boolean;
  likes: { userId: string }[];
};
export default function Post({
  id,
  author,
  text,
  isBookmarked,
  likes,
}: PostProps) {
  const router = useRouter();
  const [totalLikes, setTotalLikes] = useState(likes.length);
  const liked = likes.find((like) => like.userId === user.id);

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
      <div className="relative h-10 w-10 shrink-0 overflow-clip rounded-full">
        <Image
          src={
            author?.avatar ??
            "https://avatars.githubusercontent.com/u/142317935?v=4"
          }
          alt="avatar"
          fill
        />
      </div>
      <div className="flex-1">
        <header className="flex items-center">
          <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap pr-2 font-semibold">
            {author.displayName}
          </span>
          <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-sm tracking-wide text-gray-400/70">
            @{author.handle}
          </span>
          <span className="px-2 text-gray-400">·</span>
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
              <div className="">{totalLikes}</div>
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
              <div className="">{totalLikes}</div>
            </div>
          </button>

          <button
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
            onClick={handleLike}
          >
            <div className="rounded-full p-1.5 group-hover:bg-pink-500/20 group-hover:text-pink-600 ">
              <Heart size={18} />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-pink-600">
              <div className="">{totalLikes}</div>
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
              <div className="">{totalLikes}</div>
            </div>
          </div>

          <button
            className={cn(
              "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
            )}
            onClick={handleLike}
          >
            <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
              <Share size={18} />
            </div>
            <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
              <div className="">{totalLikes}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
