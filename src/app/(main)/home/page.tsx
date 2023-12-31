import { idSchema } from "@/schemas";
import { getPosts } from "@/server/db/queries";
import { ensureError } from "@/types";
import { sql } from "drizzle-orm";
import PostsList from "@/app/_components/Post/PostsList";
import db from "@/server/db";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";

export default async function Home() {
  const user = await getUser();
  if (!user) redirect("/");

  try {
    const postIds = await db.execute(
      sql`SELECT id FROM posts WHERE parent_id IS NULL ORDER BY created_at DESC`,
    );
    const posts = await getPosts({
      viewerId: user.id,
      postIds: idSchema.array().parse(postIds.rows),
    });

    return <PostsList posts={posts} userId={user.id} />;
  } catch (err) {
    const error = ensureError(err);
    throw new Error(error.message);
  }
}
