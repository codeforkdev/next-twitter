import Post from "@/components/Post";
import PostForm from "@/components/PostForm";
import { db } from "@/drizzle/db";
import { bookmarks, users } from "@/drizzle/schema";
import { user } from "@/mock-data";
import { eq } from "drizzle-orm";
export default async function Home() {
  const posts = await db.query.posts.findMany({
    columns: {
      id: true,
      text: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          handle: true,
        },
      },
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

  console.log(posts);
  return (
    <div>
      <PostForm />
      <ul>
        {posts?.map((post) => (
          <li>
            <Post {...post} isBookmarked={post.bookmarks.length !== 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
