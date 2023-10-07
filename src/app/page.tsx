import Post from "@/components/Post";
import { bookmarks } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { user } from "@/mock/mock-data";
import PostForm from "@/components/PostForm";
export default async function Home() {
  try {
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
      <div>
        <PostForm />
        <ul>
          {posts?.map((post) => (
            <li key={post.id}>
              <Post
                id={post.id}
                author={post.author}
                likes={post.likes}
                text={post.text}
                isBookmarked={post.bookmarks.length !== 0}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (e) {
    console.log(e);
  }
  return <div>whoops</div>;
}
