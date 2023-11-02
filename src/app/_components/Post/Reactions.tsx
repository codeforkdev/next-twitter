"use client";
import { toggleBookmark, toggleLikePost } from "@/actions/posts";
import { UserContext } from "@/app/(main)/UserProvider";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookmarkIcon,
  HeartIcon,
  MessageCircle,
  Repeat2,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import usePartySocket from "partysocket/react";
import { setUncaughtExceptionCaptureCallback } from "process";

import { MouseEvent, useState, useContext, useRef } from "react";
import { z } from "zod";

type Props = {
  metrics: {
    likes: number;
    comments: number;
    reposts: number;
    views: number;
  };
  liked: boolean;
  bookmarked: boolean;
  postId: string;
};
export function Reactions(props: Props) {
  const user = useContext(UserContext);
  const [likes, setLikes] = useState(props.metrics.likes);
  const [comments, setComments] = useState(props.metrics.comments);
  const [reposts, setReposts] = useState(props.metrics.reposts);
  const [views, setViews] = useState(props.metrics.views);

  let party = usePartySocket({
    host: "http://localhost:1999",
    room: props.postId,
    party: "post",
    onMessage: (evt) => {
      const Schema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("likes"), data: z.number() }),
        z.object({ type: z.literal("comments"), data: z.number() }),
        z.object({ type: z.literal("reposts"), data: z.number() }),
        z.object({ type: z.literal("views"), data: z.number() }),
      ]);
      const response = Schema.parse(JSON.parse(evt.data));
      console.log(response);
      switch (response.type) {
        case "likes":
          setLikes(response.data);
          break;
        case "comments":
          setComments(response.data);
          break;
        case "reposts":
          setReposts(response.data);
          break;
        case "views":
          setViews(response.data);
          break;
      }
    },
  });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex w-full cursor-default justify-between gap-4 text-gray-500"
    >
      <CommentsButton count={comments} />
      <RepostButton isReposted={true} count={reposts} />
      <LikeButton
        userId={user.id}
        postId={props.postId}
        isLiked={props.liked}
        count={likes}
      />

      <div className="group flex items-center gap-2 rounded-full p-1.5 transition-colors">
        <div className="rounded-full p-1.5 group-hover:bg-sky-500/20 group-hover:text-sky-600 ">
          <BarChart2 size={18} />
        </div>
        <div className="relative flex h-6 w-fit items-center group-hover:text-sky-600">
          {views}
        </div>
      </div>
      <BookmarkButton
        userId={user.id}
        postId={props.postId}
        isBookmarked={props.bookmarked}
      />
    </div>
  );
}

export function BookmarkButton(props: {
  userId: string;
  postId: string;
  isBookmarked: boolean;
}) {
  const [status, setStatus] = useState(props.isBookmarked);
  const handleToggle = async () => {
    const newStatus = await toggleBookmark({
      ...props,
      isBookmarked: status,
    });
    if (newStatus !== undefined) {
      setStatus(newStatus);
    }
  };
  return (
    <button
      className="group flex items-center gap-2 rounded-full p-1.5 transition-colors group-hover:bg-sky-500/20 group-hover:text-sky-600 "
      onClick={handleToggle}
    >
      <BookmarkIcon
        size={18}
        className={cn({
          "fill-primary stroke-primary": status,
        })}
      />
    </button>
  );
}

export function LikeButton(props: {
  count: number;
  isLiked: boolean;
  postId: string;
  userId: string;
}) {
  const [c, setC] = useState(props.count);
  const [status, setStatus] = useState(props.isLiked);
  const ref = useRef<HTMLButtonElement>(null);

  const handleLike = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    ref.current.disabled = true;
    const result = await toggleLikePost(props.userId, props.postId);
    if (result !== undefined) {
      setStatus(result.liked);
      setC(result.count);
    }
    ref.current.disabled = false;
  };
  return (
    <button
      ref={ref}
      className="group flex items-center gap-2 rounded-full p-1.5 transition-colors"
      onClick={handleLike}
    >
      <div className="rounded-full p-1.5 group-hover:bg-pink-500/20 group-hover:text-pink-600 ">
        <HeartIcon
          size={18}
          className={cn({ "fill-pink-500 stroke-pink-500": status })}
        />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-pink-600">
        <div>{c !== 0 && c}</div>
      </div>
    </button>
  );
}

export function RepostButton(props: { count: number; isReposted: boolean }) {
  return (
    <button
      className="group flex items-center gap-2 rounded-full p-1.5 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rounded-full p-1.5 group-hover:bg-emerald-500/20 group-hover:text-emerald-600 ">
        <Repeat2 size={20} />
      </div>
      <div className="relative flex h-6 w-fit items-center group-hover:text-emerald-600">
        <div>{props.count}</div>
      </div>
    </button>
  );
}

export function CommentsButton(props: { count: number }) {
  return (
    <button
      className="group flex items-center gap-2 rounded-full p-1.5 transition-colors"
      onClick={(e) => e.stopPropagation()}
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
