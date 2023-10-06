import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { bookmarks, users } from "../../../drizzle/schema";
import { user } from "@/mock-data";
import { eq } from "drizzle-orm";
export default async function Page() {
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
    <ol className="flex flex-col">
      {posts?.map((post) => (
        <li className="border-b border-white/20 py-3 px-4 ">
          <Post {...post} isBookmarked={post.bookmarks.length !== 0} />
        </li>
      ))}
    </ol>
  );
}
