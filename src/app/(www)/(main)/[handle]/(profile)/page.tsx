import Post from "@/app/_components/Post";
import { verifyJWT } from "@/lib/auth";
import getSession from "@/lib/session";
import db from "@/server/db";
import { bookmarks, likes, posts, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { handle: string } }) {
  const {
    payload: { user: visitor },
  } = await verifyJWT();

  const targetPosts = db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      text: posts.text,
      userId: posts.userId,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(users.handle, params.handle))
    .as("rootposts");

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
    .where(eq(likes.userId, visitor.id))
    .as("liked");

  const bookmarked = db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, visitor.id))
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
    .innerJoin(users, eq(targetPosts.userId, users.id))
    .leftJoin(comments, eq(targetPosts.id, comments.id))
    .leftJoin(postLikes, eq(targetPosts.id, postLikes.postId))
    .leftJoin(liked, eq(targetPosts.id, liked.postId))
    .leftJoin(bookmarked, eq(targetPosts.id, bookmarked.postId))
    .groupBy(targetPosts.id);

  console.log(data);

  return (
    <ul className="divide-y divide-white/20">
      {data.map((post) => (
        <li className="px-4 py-4">
          <Post
            postId={post.id}
            authorId={post.author.id}
            postCreatedAt={""}
            handle={""}
            avatar={post.author.avatar}
            displayName={post.author.displayName}
            joinedAt={""}
            views={0}
            userId={visitor.id}
            {...post}
            liked={post.liked ? true : false}
            bookmarked={post.bookmarked ? true : false}
          />
        </li>
      ))}
    </ul>
  );
}
