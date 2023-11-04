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

  const postIds = await db.execute(
    sql.raw(`
      SELECT posts.id
      FROM posts 
      LEFT JOIN users ON posts.user_id = users.id
      WHERE users.handle = '${params.handle}'`),
  );

  const posts = await getPosts({
    viewerId: user.id,
    postIds: idSchema.array().parse(postIds.rows),
  });

  return <PostsList posts={posts} />;
}
