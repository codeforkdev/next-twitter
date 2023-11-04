"use client";
import { Avatar } from "@/app/_components/Avatar";
import { Spacer } from "@/app/_components/Spacer";
import { Share } from "lucide-react";
import { TPostSchema } from "@/schemas";
import { useContext, useState } from "react";
import { UserContext } from "@/app/(main)/UserProvider";
import usePartySocket from "partysocket/react";
import { z } from "zod";
import {
  BookmarkButton,
  CommentsButton,
  LikeButton,
  ReactionsContext,
  ReactionsProvider,
  RepostButton,
} from "@/app/_components/Post/Reactions";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export default function ParentPost(props: TPostSchema) {
  return (
    <div className="p-4 pb-0">
      <ReactionsProvider
        postId={props.id}
        bookmarked={props.bookmarked}
        liked={props.liked}
        metrics={{ ...props }}
      >
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
          <Views />
        </div>

        <Spacer className="my-4" />
        <div className="flex justify-between border-y border-white/20 px-1 py-3 text-white/40">
          <CommentsButton
            text={props.text}
            author={{
              id: props.authorId,
              avatar: props.avatar,
              displayName: props.displayName,
              handle: props.handle,
            }}
          />
          <RepostButton />
          <LikeButton />
          <BookmarkButton />
          <button>
            <Share size={20} />
          </button>
        </div>
      </ReactionsProvider>
    </div>
  );
}

const Views = () => {
  const { views } = useContext(ReactionsContext);
  return <span>{views} views</span>;
};
