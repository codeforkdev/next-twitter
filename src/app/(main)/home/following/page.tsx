import { sql } from "drizzle-orm";
import db from "@/server/db";
import { getPosts } from "@/server/db/queries";
import { idSchema } from "@/schemas";
import PostsList from "@/app/_components/Post/PostsList";
import { ensureError } from "@/types";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";
export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/");

  try {
    const query = sql`SELECT id FROM posts WHERE parent_id IS NULL`;
    const postIds = await db.execute(query);
    const posts = await getPosts({
      viewerId: user.id,
      postIds: idSchema.array().parse(postIds.rows),
    });

    return <PostsList userId={user.id} posts={posts} />;
  } catch (err) {
    const error = ensureError(err);
    throw new Error(error.message);
  }
}
