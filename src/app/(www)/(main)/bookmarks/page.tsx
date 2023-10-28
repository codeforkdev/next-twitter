import Post from "@/app/_components/Post";
import { eq, sql } from "drizzle-orm";
import { Aside, MainLayout } from "../home/layout";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Spacer } from "@/app/_components/Spacer";
import { verifyJWT } from "@/lib/auth";
import { bookmarks, likes, posts, users } from "@/server/db/schema";
import db from "@/server/db";

export default async function Page() {
  const {
    payload: { user },
  } = await verifyJWT();

  const targetPosts = db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      text: posts.text,
      userId: posts.userId,
    })
    .from(bookmarks)
    .leftJoin(posts, eq(bookmarks.postId, posts.id))
    .where(eq(bookmarks.userId, user.id))
    .as("target_posts");

  const comments = db
    .select({
      id: targetPosts.id,
      count: sql<number>`count(${targetPosts.id})`
        .mapWith(Number)
        .as("comments"),
    })
    .from(targetPosts)
    .innerJoin(posts, eq(targetPosts.id, posts.parentId))
    .groupBy(targetPosts.id)
    .as("comments");

  const postLikes = db
    .select({
      postId: targetPosts.id,
      count: sql<number>`count(${targetPosts.id})`.mapWith(Number).as("count"),
    })
    .from(targetPosts)
    .leftJoin(likes, eq(targetPosts.id, likes.postId))
    .groupBy(targetPosts.id)
    .as("post_likes");

  const liked = db
    .select()
    .from(likes)
    .where(eq(likes.userId, user.id))
    .groupBy()
    .as("liked");

  const bookmarked = db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, user.id))
    .as("bookmarked");

  const data = await db
    .select({
      id: targetPosts.id,
      createdAt: targetPosts.createdAt,
      text: targetPosts.text,
      likes: postLikes.count,
      comments: comments.count,
      author: users,
      liked: liked.userId,
      bookmarked: bookmarked.userId,
    })
    .from(targetPosts)
    .leftJoin(users, eq(targetPosts.userId, users.id))
    .leftJoin(comments, eq(targetPosts.id, comments.id))
    .leftJoin(postLikes, eq(targetPosts.id, postLikes.postId))
    .leftJoin(liked, eq(targetPosts.id, liked.postId))
    .leftJoin(bookmarked, eq(targetPosts.id, bookmarked.postId));

  console.log("BOOKMARKS =>", data);

  return (
    <MainLayout
      main={
        <>
          <div className="flex px-4 py-1.5">
            <div>
              <p className="text-xl font-bold">Bookmarks</p>
              <p className="text-xs text-gray-300/50">@{user.handle}</p>
            </div>
            <button className="ml-auto pr-1">
              <MoreHorizontal size={20} />
            </button>
          </div>
          {data.length > 0 && (
            <ul>
              {data.map((post) => (
                <li
                  key={post.id}
                  className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
                >
                  {/* <Post
                    userId={session.user.id}
                    {...post}
                    bookmarked={post.bookmarked ? true : false}
                    liked={post.liked ? true : false}
                    likes={5}
                  /> */}
                </li>
              ))}
            </ul>
          )}

          {data.length === 0 && (
            <>
              <Spacer className="mt-[1.9rem]" />
              <div className="mx-auto flex max-w-sm flex-col gap-2 px-5">
                <p className="text-3xl font-bold">Save posts for later</p>
                <p className="text-sm text-gray-300/50">
                  Bookmark posts to easily find them again in the future.
                </p>
              </div>
            </>
          )}
        </>
      }
      aside={<Aside />}
    />
  );
}
