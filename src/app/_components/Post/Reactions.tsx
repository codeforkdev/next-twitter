"use client";
import { submitReply, toggleBookmark, toggleLikePost } from "@/actions/posts";
import { UserContext } from "@/app/(main)/UserProvider";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookmarkIcon,
  CalendarCheck2Icon,
  HeartIcon,
  ImageIcon,
  ListTodoIcon,
  LucideIcon,
  MapPinIcon,
  MessageCircle,
  Repeat2,
  XIcon,
} from "lucide-react";
import usePartySocket from "partysocket/react";
import Image from "next/image";
import React, { useState, useContext, createContext } from "react";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactTextareaAutosize from "react-textarea-autosize";
import PostProgress from "./Progress";
import { TPostSchema } from "@/schemas";
import { users } from "@/server/db/schema";
import { Avatar } from "../Avatar";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { Spacer } from "../Spacer";
type Props = {
  children: React.ReactNode;
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

// type Props2 = {
//   children: React.ReactNode;
//   metrics: {
//     likes: number;
//     comments: number;
//     reposts: number;
//     views: number;
//   };
//   liked: boolean;
//   bookmarked: boolean;
//   postId: string;
// };

type ReactionsContext = {
  postId: string;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  liked: boolean;
  bookmarked: boolean;
  like: () => void;
  bookmark: () => void;
};

export const ReactionsContext = createContext<ReactionsContext>({
  postId: "",
  likes: 0,
  liked: false,
  bookmarked: false,
  comments: 0,
  reposts: 0,
  views: 0,
  like: () => {},
  bookmark: () => {},
});

export const ReactionsProvider = (props: Props) => {
  const { id: userId } = useContext(UserContext);
  const [likes, setLikes] = useState(props.metrics.likes);
  const [comments, setComments] = useState(props.metrics.comments);
  const [reposts, setReposts] = useState(props.metrics.reposts);
  const [views, setViews] = useState(props.metrics.views);
  const [liked, setLiked] = useState(props.liked);
  const [bookmarked, setBookmarked] = useState(props.bookmarked);
  usePartySocket({
    host: "http://localhost:1999",
    room: props.postId,
    party: "post",
    onMessage: (evt) => {
      const Schema = z.discriminatedUnion("type", [
        z.object({
          type: z.literal("likes"),
          data: z.object({
            userId: z.string(),
            count: z.number(),
            isLiked: z.boolean(),
          }),
        }),
        z.object({
          type: z.literal("comments"),
          data: z.object({ comments: z.number() }),
        }),
        z.object({ type: z.literal("reposts"), data: z.number() }),
        z.object({ type: z.literal("views"), data: z.number() }),
      ]);
      const response = Schema.parse(JSON.parse(evt.data));
      switch (response.type) {
        case "likes":
          setLikes(response.data.count);
          if (response.data.userId === userId) {
            setLiked(response.data.isLiked);
          }
          break;
        case "comments":
          setComments(response.data.comments);
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

  const like = async () => {
    await toggleLikePost(userId, props.postId);
  };

  const bookmark = async () => {
    const response = await toggleBookmark({ userId, postId: props.postId });
    if (response !== undefined) {
      setBookmarked(response);
    }
  };
  return (
    <ReactionsContext.Provider
      value={{
        postId: props.postId,
        likes,
        comments,
        reposts,
        views,
        liked,
        bookmarked,
        like,
        bookmark,
      }}
    >
      {props.children}
    </ReactionsContext.Provider>
  );
};

export function Reactions(props: Props) {
  return (
    <ReactionsProvider {...props}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full cursor-default justify-between gap-4 text-gray-500"
      >
        {/* <CommentsButton author={{}} /> */}
        <RepostButton />
        <LikeButton />
        <ViewsButton />
        <BookmarkButton />
      </div>
    </ReactionsProvider>
  );
}

const Button = (props: {
  Icon: LucideIcon;
  count?: number;
  styles: {
    text: string;
    bg: string;
    icon: string;
  };
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={props?.onClick}
      className="group flex items-center gap-2 rounded-full p-1.5 transition-colors"
    >
      <div className={cn("rounded-full p-1.5 ", props.styles.bg)}>
        {<props.Icon size={18} className={cn(props.styles.icon)} />}
      </div>
      {(props?.count ?? 0) > 0 && (
        <div
          className={cn(
            "relative flex h-6 w-fit items-center text-xs",
            props.styles.text,
          )}
        >
          {props.count}
        </div>
      )}
    </button>
  );
};
export function ViewsButton() {
  const { views } = useContext(ReactionsContext);
  return (
    <Button
      Icon={BarChart2}
      count={views}
      styles={{
        bg: "group-hover:bg-sky-500/20",
        text: "group-hover:text-sky-600",
        icon: `group-hover:stroke-sky-600`,
      }}
    />
  );
}

export function BookmarkButton() {
  const { bookmark, bookmarked } = useContext(ReactionsContext);
  return (
    <Button
      Icon={BookmarkIcon}
      onClick={bookmark}
      styles={{
        bg: "group-hover:bg-sky-500/20",
        text: "group-hover:text-sky-600",
        icon: `group-hover:stroke-sky-600 ${
          bookmarked && "stroke-sky-600 fill-sky-700"
        }`,
      }}
    />
  );
}

export function LikeButton() {
  const { likes, liked, like } = useContext(ReactionsContext);
  return (
    <>
      <Button
        Icon={HeartIcon}
        onClick={like}
        count={likes}
        styles={{
          bg: "group-hover:bg-pink-500/20",
          text: "group-hover:text-pink-600",
          icon: `group-hover:stroke-pink-600 ${
            liked && "stroke-pink-600 fill-pink-500"
          }`,
        }}
      />
    </>
  );
}

export function RepostButton() {
  const { reposts } = useContext(ReactionsContext);
  const [open, setOpen] = useState(false);
  return (
    <Button
      Icon={Repeat2}
      onClick={() => {
        setOpen(true);
      }}
      count={reposts}
      styles={{
        bg: "group-hover:bg-emerald-500/20",
        text: "group-hover:text-emerald-600",
        icon: `group-hover:stroke-emerald-600 `,
      }}
    />
  );
}

export function CommentsButton({
  author,
  text,
}: {
  author: Pick<
    typeof users.$inferInsert,
    "handle" | "displayName" | "id" | "avatar"
  >;
  text: string;
}) {
  const user = useContext(UserContext);
  const { postId } = useContext(ReactionsContext);
  const { comments } = useContext(ReactionsContext);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [reply, setReply] = useState("");
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Button
          Icon={MessageCircle}
          count={comments}
          onClick={() => setOpen(true)}
          styles={{
            bg: "group-hover:bg-sky-500/20",
            text: "group-hover:text-sky-600",
            icon: `group-hover:stroke-sky-600 `,
          }}
        />
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-[998] bg-white/10"
            style={{ backdropFilter: "blur(4px)" }}
          />
          <Dialog.Content
            onInteractOutside={(e) => {
              e.preventDefault();
              reply.trim().length > 0 ? setConfirm(true) : setOpen(false);
            }}
            className="fixed left-1/2 top-[5%] z-[999] w-full max-w-[600px] -translate-x-1/2 rounded-xl bg-black px-4"
          >
            <div className="flex flex-col  ">
              <header className="flex h-[54px] items-center gap-[30px]">
                <Dialog.Close>
                  <XIcon size={21} />
                </Dialog.Close>
                <Link
                  href="/compose/post/unsent/drafts"
                  className="ml-auto pr-4 text-sm font-semibold text-primary"
                >
                  Drafts
                </Link>
              </header>
              <main className="pt-[15px]">
                <div className="flex  flex-col">
                  {/* author and post text */}
                  <div className=" flex h-full content-stretch gap-[14px] ">
                    <div className=" flex flex-col items-center">
                      <Avatar src={author.avatar} className="h-10 w-10" />
                      <div className="w-[2px] flex-1 bg-gray-700" />
                    </div>

                    <div className="flex-1 ">
                      <div className="flex items-center gap-2 text-sm">
                        <p className="font-semibold text-gray-100">
                          {author.displayName}
                        </p>
                        <p className="text-white/50">@{author.handle}</p>
                      </div>
                      <p className="text-sm">{text}</p>
                      <Spacer className="py-2" />
                      <p className="flex gap-2 text-sm">
                        <span className="text-gray-500">Replying to</span>
                        <span className="text-primary">@{author.handle}</span>
                      </p>
                      <Spacer className="py-1" />
                    </div>
                  </div>
                  <Spacer className="py-3" />
                  {/* viewer reply */}
                  <div className=" flex gap-[14px]">
                    <Avatar className="h-10 w-10" src={user.avatar} />
                    <div className="flex min-h-[100px] flex-1 flex-col gap-[14px] ">
                      <label
                        htmlFor="text"
                        className="h-full
                       flex-1 overflow-y-auto "
                      >
                        <ReactTextareaAutosize
                          id="text"
                          placeholder="Post your reply"
                          className="h-full w-full resize-none bg-transparent text-xl outline-none placeholder:text-white/40"
                          onInput={(e) => setReply(e.currentTarget.value)}
                          value={reply}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </main>
            </div>

            {/* <div className="-mx-[8px] h-[1px] bg-white/20" /> */}
            <div className="flex h-[62px] items-center gap-[18px] px-1 text-primary">
              <ImageIcon size={18} />
              <button className="rounded-sm border border-primary text-[8px] font-semibold">
                GIF
              </button>
              <ListTodoIcon size={20} />
              <CalendarCheck2Icon size={19} />
              <MapPinIcon size={17} />
              <div className="ml-auto flex items-center gap-4">
                {reply.length !== 0 && (
                  <PostProgress max={500} length={reply.length} />
                )}

                <button
                  disabled={reply.trim().length === 0}
                  onClick={() =>
                    submitReply({ userId: user.id, text: reply, postId })
                  }
                  className="rounded-full bg-primary px-[17px] py-[7px] text-sm text-white disabled:opacity-50"
                >
                  Reply
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={confirm} onOpenChange={setConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-[999] bg-white/10"
            style={{ backdropFilter: "blur(4px)" }}
          />
          <Dialog.Content className="fixed left-1/2 top-[50%] z-[999]  w-full max-w-xs -translate-x-1/2  rounded-xl bg-black p-8">
            <p className="text-lg font-semibold">Save post ?</p>
            <p className="text-sm text-gray-400">
              You can save this to send later from your drafts.{" "}
            </p>
            <Spacer className="py-2" />
            <button className="w-full rounded-full bg-gray-100 py-3 font-semibold text-black">
              Save
            </button>
            <Spacer className="py-1" />
            <button
              onClick={() => {
                setOpen(false);
                setConfirm(false);
              }}
              className="w-full rounded-full border py-3 font-semibold text-gray-100"
            >
              Discard
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
