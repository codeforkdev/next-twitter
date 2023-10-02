import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { bookmarks, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  const userBookmarks = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, "123123123123123123123"),
    with: {
      post: {
        columns: {
          id: true,
          text: true,
          userId: true,
        },
        with: {
          user: true,
          likes: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });
  console.log("bookmarks", bookmarks);
  return (
    <div>
      <p>Bookmarks</p>
      <ul>
        {userBookmarks.map((bookmark) => (
          <li>
            <Post
              {...bookmark.post}
              isBookmarked={true}
              likes={bookmark.post.likes}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
