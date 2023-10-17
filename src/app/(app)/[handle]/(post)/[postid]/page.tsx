import { MainLayout } from "@/app/(app)/home/layout";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import PostReply from "./@components/PostReply";
import { desc, eq } from "drizzle-orm";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import Post from "@/components/Post";

export default async function Page({ params }: { params: { postid: string } }) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, params.postid),
    with: {
      author: true,
      bookmarks: true,
    },
  });

  const replies = await db.query.posts.findMany({
    where: eq(posts.parentId, params.postid),
    with: {
      author: true,
      likes: {
        columns: {
          userId: true,
        },
      },
    },
    orderBy: desc(posts.createdAt),
  });

  if (!post) {
    return <div>Could not find post</div>;
  }

  return (
    <MainLayout
      main={
        <>
          <Header />
          <div className="p-4 pb-0">
            <div className="flex gap-4">
              <Avatar src={post.author.avatar ?? ""} className="h-10 w-10" />
              <div>
                <p className="font-semibold">{post.author.displayName}</p>
                <p className="text-white/40">@{post.author.handle}</p>
              </div>
            </div>
            {/* post content */}
            <Spacer className="my-2" />
            <div>
              <p>{post.text}</p>
            </div>

            {/* post date and views */}
            <Spacer className="my-4" />
            <div className="flex gap-2 text-sm text-white/50">
              <span>
                {post.createdAt.toLocaleTimeString("en-us", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              ·
              <span>
                {post.createdAt.toLocaleDateString("en-us", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* post toolbar */}
            <Spacer className="my-4" />
            <div className="flex justify-between border-y border-white/20 px-1 py-3 text-white/40">
              <button>
                <MessageCircle size={20} />
              </button>
              <button>
                <Repeat2 size={22} />
              </button>
              <button>
                <Heart size={20} />
              </button>
              <button>
                <Bookmark size={20} />
              </button>
              <button>
                <Share size={20} />
              </button>
            </div>

            {/* post reply */}
            <Spacer className="my-4" />
            <PostReply postId={post.id} handle={post.author.handle} />
            {/*  */}
          </div>
          <ul>
            {replies.map((reply) => {
              return (
                <li
                  key={post.id}
                  className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
                >
                  <Post
                    key={reply.id}
                    {...reply}
                    isBookmarked={post.bookmarks.length !== 0}
                  />
                </li>
              );
            })}
          </ul>
        </>
      }
      aside={<></>}
    />
  );
}

const Header = () => {
  return (
    <div
      className="sticky top-0 z-50 flex items-center gap-9 bg-black/70 px-4 py-3"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <BackButton>
        <ArrowLeft size={20} />
      </BackButton>

      <p className="text-xl font-semibold">Post</p>
    </div>
  );
};
