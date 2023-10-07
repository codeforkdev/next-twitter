import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { user } from "@/mock/mock-data";
import { bookmarks } from "@/drizzle/schema";
export default async function Home() {
  const posts = await db.query.posts.findMany({
    columns: {
      id: true,
      text: true,
    },
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
      {posts.map((post) => (
        <li className="border-b border-white/20 py-3 px-4 ">
          <Post {...post} isBookmarked={post.bookmarks.length !== 0} />
        </li>
      ))}
    </ol>
  );
}
