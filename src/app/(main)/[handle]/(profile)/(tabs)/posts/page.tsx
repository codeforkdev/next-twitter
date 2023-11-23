import PostsList from "@/app/_components/Post/PostsList";
import { verifyJWT } from "@/lib/auth";
import { idSchema } from "@/schemas";
import db from "@/server/db";
import { getPosts } from "@/server/db/queries";
import { sql } from "drizzle-orm";

export default async function Page({ params }: { params: { handle: string } }) {
  const {
    payload: { user },
  } = await verifyJWT();

  if (!user) return <div>User not found</div>;

  const query = sql`SELECT id FROM posts WHERE user_id = ${user.id}`;
  const postIds = await db.execute(query);
  const posts = await getPosts({
    viewerId: user.id,
    postIds: idSchema.array().parse(postIds.rows),
  });

  return <PostsList posts={posts} userId={user.id} />;
}
