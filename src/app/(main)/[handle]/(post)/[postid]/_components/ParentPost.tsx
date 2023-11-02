"use client";
import { Avatar } from "@/app/_components/Avatar";
import { Spacer } from "@/app/_components/Spacer";
import { Bookmark, Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { TPostSchema } from "@/schemas";
import { useContext, useState } from "react";
import { UserContext } from "@/app/(main)/UserProvider";
import usePartySocket from "partysocket/react";
import { z } from "zod";
import { toggleLikePost } from "@/actions/posts";
import { LikeButton } from "@/app/_components/Post/Reactions";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export default function ParentPost(props: TPostSchema) {
  const user = useContext(UserContext);
  const [likes, setLikes] = useState(props.likes);
  const [comments, setComments] = useState(props.comments);
  const [reposts, setReposts] = useState(props.reposts);
  const [views, setViews] = useState(props.views);

  let socket = usePartySocket({
    host: "http://localhost:1999",
    room: props.id,
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
    <div className="p-4 pb-0">
      <div className="flex gap-4">
        <Avatar src={props.avatar ?? ""} className="h-8 w-8" />
        <div>
          <p className="font-semibold">{props.displayName}</p>
          <p className="text-white/40">@{props.handle}</p>
        </div>
      </div>
      <Spacer className="my-2" />
      <div>
        <p>{props.text}</p>
      </div>

      <Spacer className="my-4" />
      <div className="flex gap-2 text-sm text-white/50">
        <span>
          {props.createdAt.toLocaleTimeString("en-us", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        ·
        <span>
          {props.createdAt.toLocaleDateString("en-us", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
        <span>{views} views</span>
      </div>

      <Spacer className="my-4" />
      <div className="flex justify-between border-y border-white/20 px-1 py-3 text-white/40">
        <button>
          <MessageCircle size={20} />
        </button>
        <button>
          <Repeat2 size={22} />
        </button>
        <LikeButton
          count={props.likes}
          isLiked={props.liked}
          postId={props.id}
          userId={user.id}
        />
        <button>
          <Bookmark size={20} />
        </button>
        <button>
          <Share size={20} />
        </button>
      </div>
    </div>
  );
}
