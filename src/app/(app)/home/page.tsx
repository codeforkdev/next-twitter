import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { user } from "@/mock/mock-data";
import { bookmarks, posts } from "@/drizzle/schema";
export const revalidate = true;

export default async function Home() {
  const data = await db.query.posts.findMany({
    columns: {
      id: true,
      text: true,
    },
    orderBy: desc(posts.createdAt),
    with: {
      author: true,
      bookmarks: {
        where: eq(bookmarks.userId, user.id),
      },
      likes: {
        columns: {
          userId: true,
        },
      },
    },
  });

  return (
    <ol>
      {data.map((post) => {
        post.author;
        return (
          <li
            key={post.id}
            className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
          >
            <Post {...post} isBookmarked={post.bookmarks.length !== 0} />
          </li>
        );
      })}
    </ol>
  );
}
