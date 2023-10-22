import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
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

  const data = await db
    .select({
      id: targetPosts.id,
      createdAt: targetPosts.createdAt,
      text: targetPosts.text,
      likes: sql<number>`count(${likes.id})`.mapWith(Number),
      comments: comments.count,
      author: users,
    })
    .from(targetPosts)
    .innerJoin(users, eq(targetPosts.userId, users.id))
    .leftJoin(comments, eq(targetPosts.id, comments.id))
    .leftJoin(likes, eq(targetPosts.id, likes.postId))
    .groupBy(targetPosts.id);

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
              likes={post.likes}
              isBookmarked={true}
            />
          </li>
        );
      })}
    </ol>
  );
}
