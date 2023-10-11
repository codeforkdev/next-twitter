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

type PostProps = {
  id: string;
  text: string;
  author: {
    id: string;
    handle: string;
    avatar: string | null;
    displayName: string;
  };
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
  const liked = likes.find((like) => like.userId === user.id);
  return (
    <div
      onClick={() => router.push(`/${user.handle}/${id}`)}
      className=" cursor-pointer flex gap-3 "
    >
      <div className="relative w-10 h-10 rounded-full overflow-clip shrink-0">
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
          <span className="font-semibold pr-2 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            {author.displayName}
          </span>
          <span className="text-sm text-gray-400/70 tracking-wide max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            @{author.handle}
          </span>
          <span className="text-gray-400 px-2">·</span>
          <span className="text-gray-400 text-sm">20h</span>
          <button className="ml-auto">
            <MoreHorizontal size={18} className="text-gray-400" />
          </button>
        </header>

        <div className="text-gray-200">{text}</div>
        <div className="mt-2" />
        <div className="flex gap-4 justify-between w-full text-gray-500">
          <button
            className={cn({
              // "bg-gray-500": !isBookmarked,
              "bg-green-500": isBookmarked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({ userId: user.id, postId: id, isBookmarked });
            }}
          >
            <MessageCircle size={18} />
          </button>
          <button
            className={cn({
              // "bg-gray-500": !isBookmarked,
              "bg-green-500": isBookmarked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({ userId: user.id, postId: id, isBookmarked });
            }}
          >
            <Repeat2 size={20} />
          </button>
          <button
            className={cn({
              "text-gray-400": !liked,
              "text-pink-500": liked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike({
                userId: user.id,
                postId: id,
                isLiked: liked !== undefined,
              });
            }}
          >
            <Heart size={16} />
          </button>
          <button
            className={cn({
              // "bg-gray-500": !liked,
              "bg-pink-500": liked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike({
                userId: user.id,
                postId: id,
                isLiked: liked !== undefined,
              });
            }}
          >
            <BarChart2 size={18} />
          </button>
          {/* <button
            className={cn({
              // "bg-gray-500": !liked,
              "bg-pink-500": liked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike({
                userId: user.id,
                postId: id,
                isLiked: liked !== undefined,
              });
            }}
          >
            <Share size={18} />
          </button> */}
          <button
            className={cn({
              "bg-gray-500": !isBookmarked,
              "bg-green-500": isBookmarked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({ userId: user.id, postId: id, isBookmarked });
            }}
          >
            Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}
