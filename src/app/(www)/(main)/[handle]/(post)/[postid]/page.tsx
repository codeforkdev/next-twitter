import { Avatar } from "@/app/_components/Avatar";
import { Spacer } from "@/app/_components/Spacer";
import PostReply from "./@components/PostReply";
import { desc, eq, isNull, sql } from "drizzle-orm";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import BackButton from "@/app/_components/BackButton";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import { nanoid } from "nanoid";
import db from "@/server/db";
import { MainLayout } from "@/app/_layouts/MainLayout";
import Post from "@/app/_components/Post/Root";
import { views } from "@/server/db/schema";
import { verifyJWT } from "@/lib/auth";
import { postSchema, postUserSchema } from "../../../home/page";

export default async function Page({ params }: { params: { postid: string } }) {
  const {
    payload: { user },
  } = await verifyJWT();

  const postResponse = await db.execute(
    sql.raw(`
SELECT 
      posts.id, 
      posts.parent_id as 'parentId',
      posts.text,
      posts.created_at as 'createdAt',
      users.id as 'userId',
      users.avatar,
      users.display_name as 'displayName',
      users.handle,
      count(likes.post_id) as likes,
      count(post_views.post_id) as views,
      count(bu.post_id) as bookmarked
    FROM posts JOIN users on posts.user_id = users.id
    LEFT JOIN likes on posts.id = likes.post_id
    LEFT JOIN post_views on posts.id = post_views.post_id 
    LEFT JOIN (SELECT post_id FROM bookmarks WHERE bookmarks.user_id = ${user.id}) as bu on bu.post_id = posts.id
    WHERE posts.id = '${params.postid}'
    GROUP BY posts.id
  `),
  );

  const post = postUserSchema.parse(postResponse.rows[0]);
  console.log("POST >>>> ", post);

  // if (true) {
  //   return <div className="text-white">Could not find post</div>;
  // }

  const commentsResponse = await db.execute(
    sql.raw(`
SELECT 
      posts.id, 
      posts.parent_id as 'parentId',
      posts.text,
      posts.created_at as 'createdAt',
      users.id as 'userId',
      users.avatar,
      users.display_name as 'displayName',
      users.handle,
      count(likes.post_id) as likes,
      count(post_views.post_id) as views,
      count(bu.post_id) as bookmarked
    FROM posts JOIN users on posts.user_id = users.id
    LEFT JOIN likes on posts.id = likes.post_id
    LEFT JOIN post_views on posts.id = post_views.post_id 
    LEFT JOIN (SELECT post_id FROM bookmarks WHERE bookmarks.user_id = ${user.id}) as bu on bu.post_id = posts.id
    WHERE parent_id = '${params.postid}'
    GROUP BY posts.id
    `),
  );

  const comments = postUserSchema.array().parse(commentsResponse.rows);

  console.log("POST", post);
  console.log(comments);

  return (
    <MainLayout
      main={
        <>
          <Header />
          <div className="p-4 pb-0">
            <div className="flex gap-4">
              <Avatar src={post.avatar ?? ""} className="h-10 w-10" />
              <div>
                <p className="font-semibold">{post.displayName}</p>
                <p className="text-white/40">@{post.handle}</p>
              </div>
            </div>
            <Spacer className="my-2" />
            <div>
              <p>{post.text}</p>
            </div>

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
              <span>{}0 views</span>
            </div>

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

            <Spacer className="my-4" />
            <PostReply
              postId={post.id}
              handle={user.handle}
              userId={user.id}
              avatar={user.avatar}
            />
          </div>
          <ul>
            {comments.map((post) => {
              return (
                <li
                  key={post.id}
                  className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
                >
                  <Post
                    id={post.id}
                    text={post.text}
                    viewer={{
                      bookmarked: post.bookmarked,
                      liked: false,
                    }}
                    metrics={{
                      likes: post.likes,
                      comments: 0,
                      views: post.views,
                      reposts: 0,
                    }}
                    author={{
                      id: post.userId,
                      avatar: post.avatar,
                      displayName: post.displayName,
                      handle: post.handle,
                    }}
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
