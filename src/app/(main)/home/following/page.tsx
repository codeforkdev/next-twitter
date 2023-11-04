import { eq, sql } from "drizzle-orm";
import db from "@/server/db";
import { verifyJWT } from "@/lib/auth";
import { getPosts } from "@/server/db/queries";
import { idSchema } from "@/schemas";
import PostsList from "@/app/_components/Post/PostsList";
import { ensureError } from "@/types";
export default async function Page() {
  const {
    payload: { user },
  } = await verifyJWT();

  try {
    const query = sql`SELECT id FROM posts WHERE parent_id IS NULL`;
    const postIds = await db.execute(query);
    const posts = await getPosts({
      viewerId: user.id,
      postIds: idSchema.array().parse(postIds.rows),
    });

    return <PostsList posts={posts} />;
  } catch (err) {
    const error = ensureError(err);
    throw new Error(error.message);
  }
}
