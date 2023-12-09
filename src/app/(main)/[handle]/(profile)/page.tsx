import { getUser } from "@/actions/auth";
import PostsList from "@/app/_components/Post/PostsList";
import { idSchema } from "@/schemas";
import db from "@/server/db";
import { getPosts } from "@/server/db/queries";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { handle: string } }) {
  const user = await getUser();
  if (!user) redirect("/");

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

  return <PostsList userId={user.id} posts={posts} />;
}
