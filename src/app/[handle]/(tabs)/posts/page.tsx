import Post from "@/components/Post";
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function Page({ params }: { params: { handle: string } }) {
  const user = await db.query.users.findFirst({
    where: eq(users.handle, params.handle),
    with: {
      posts: {
        with: {
          likes: true,
        },
      },
    },
  });
  if (!user) return <div>User not found</div>;
  return (
    <ul>
      {user.posts.map((post) => (
        <li className="px-4 py-4">
          <Post author={user} {...post} isBookmarked={false} />
        </li>
      ))}
    </ul>
  );
}
