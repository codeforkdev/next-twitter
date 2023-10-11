import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { bookmarks, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { Aside, MainLayout } from "../home/layout";

export default async function Page() {
  const userBookmarks = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, "1"),
    with: {
      post: {
        columns: {
          id: true,
          text: true,
          userId: true,
        },
        with: {
          author: true,
          likes: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });
  return (
    <MainLayout
      main={
        <>
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
        </>
      }
      aside={<Aside />}
    />
  );
}
