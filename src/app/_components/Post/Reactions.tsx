"use client";
import { toggleLikePost } from "@/app/actions/posts";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookmarkIcon,
  HeartIcon,
  MessageCircle,
  Repeat2,
} from "lucide-react";

import { useEffect, MouseEvent, useState } from "react";

type Props = {
  comments: number;
  likes: number;
  reposts: number;
  liked: boolean;
  bookmarked: boolean;
  postId: string;
  userId: string;
};
export function Reactions(props: Props) {
  return (
    <div className="flex w-full justify-between gap-4 text-gray-500">
      <CommentsButton count={props.comments} />
      <RepostButton isReposted={true} count={props.reposts} />
      <LikeButton
        userId={props.userId}
        postId={props.postId}
        isLiked={true}
        count={props.likes}
      />

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
      <BookmarkButton isBookmarked={true} />
    </div>
  );
}

export function BookmarkButton(props: { isBookmarked: boolean }) {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
      )}
      //   onClick={handleBookmark}
    >
      <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
        <BookmarkIcon
          size={18}
          className={cn({
            "fill-primary stroke-primary": props.isBookmarked,
          })}
        />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
        <div className=""></div>
      </div>
    </button>
  );
}

export function LikeButton(props: {
  count: number;
  isLiked: boolean;
  postId: string;
  userId: string;
}) {
  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleLikePost(props.userId, props.postId);
  };
  return (
    <button
      className="group flex items-center gap-2 rounded-full p-1.5 transition-colors"
      onClick={handleLike}
    >
      <div className="rounded-full p-1.5 group-hover:bg-pink-500/20 group-hover:text-pink-600 ">
        <HeartIcon
          size={18}
          className={cn({ "fill-pink-500 stroke-pink-500": props.count })}
        />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-pink-600">
        <div>{props.count !== 0 && props.count}</div>
      </div>
    </button>
  );
}

export function RepostButton(props: { count: number; isReposted: boolean }) {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
      )}
      onClick={(e) => {
        e.stopPropagation();
        // toggleBookmark({ userId, postId: id, isBookmarked: bookmarked });
      }}
    >
      <div className="rounded-full p-1.5 group-hover:bg-emerald-500/20 group-hover:text-emerald-600 ">
        <Repeat2 size={20} />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-emerald-600">
        <div className="">{props.count}</div>
      </div>
    </button>
  );
}

export function CommentsButton(props: { count: number }) {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 rounded-full p-1.5 transition-colors",
      )}
      //   onClick={handleLike}
    >
      <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
        <MessageCircle size={18} />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
        <div className="">{props.count}</div>
      </div>
    </button>
  );
}
