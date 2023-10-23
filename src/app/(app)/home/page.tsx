import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { bookmarks, likes, posts, users } from "@/drizzle/schema";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { alias, int } from "drizzle-orm/mysql-core";
export const revalidate = true;

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/");
  // const data = await db.query.posts.findMany({
  //   where: isNull(posts.parentId),
  //   columns: {
  //     id: true,
  //     text: true,
  //   },
  //   orderBy: desc(posts.createdAt),
  //   with: {
  //     author: true,
  //     bookmarks: {
  //       where: eq(bookmarks.userId, session.user.id),
  //     },
  //     likes: {
  //       columns: {
  //         userId: true,
  //       },
  //     },
  //   },
  // });

  const targetPosts = db
    .select()
    .from(posts)
    .where(isNull(posts.parentId))
    .as("rootposts");

  console.log(targetPosts);

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
    .where(eq(likes.userId, session.user.id))
    .as("liked");

  const data = await db
    .select({
      id: targetPosts.id,
      createdAt: targetPosts.createdAt,
      text: targetPosts.text,
      likes: postLikes.count,
      comments: comments.count,
      author: users,
      liked: liked.userId,
    })
    .from(targetPosts)
    .innerJoin(users, eq(targetPosts.userId, users.id))
    .leftJoin(comments, eq(targetPosts.id, comments.id))
    .leftJoin(postLikes, eq(targetPosts.id, postLikes.postId))
    .leftJoin(liked, eq(targetPosts.id, liked.postId))
    .groupBy(targetPosts.id);
  console.log(data);
  return (
    <ol>
      {data.map((post) => {
        return (
          <li
            key={post.id}
            className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
          >
            <Post
              author={post.author}
              text={post.text}
              comments={post.comments}
              id={post.id}
              liked={post.liked ? true : false}
              likes={post.likes}
              isBookmarked={true}
            />
          </li>
        );
      })}
    </ol>
  );
}
