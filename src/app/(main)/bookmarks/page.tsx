import { sql } from "drizzle-orm";
import { MoreHorizontal } from "lucide-react";
import { verifyJWT } from "@/lib/auth";
import db from "@/server/db";
import { MainLayout } from "@/app/_layouts/MainLayout";
import { Aside } from "../home/layout";
import { Spacer } from "@/app/_components/Spacer";
import { getPosts } from "@/server/db/queries";
import PostsList from "@/app/_components/Post/PostsList";
import { idSchema } from "@/schemas";

export default async function Page() {
  const {
    payload: { user },
  } = await verifyJWT();

  try {
    const response = await db.execute(
      sql`
      SELECT 
        posts.id,
        posts.user_Id as authorId
      FROM bookmarks   
      LEFT JOIN posts ON bookmarks.post_id = posts.id
      WHERE bookmarks.user_id = ${user.id}
      `,
    );

    const postIds = idSchema.array().parse(response.rows);

    if (postIds.length === 0) {
      return (
        <>
          <Spacer className="mt-[1.9rem]" />
          <div className="mx-auto flex max-w-sm flex-col gap-2 px-5">
            <p className="text-3xl font-bold">Save posts for later</p>
            <p className="text-sm text-gray-300/50">
              Bookmark posts to easily find them again in the future.
            </p>
          </div>
        </>
      );
    }

    const posts = await getPosts({ viewerId: user.id, postIds });

    return (
      <MainLayout
        main={
          <>
            <div className="flex px-4 py-1.5">
              <div>
                <p className="text-xl font-bold">Bookmarks</p>
                <p className="text-xs text-gray-300/50">@{user.handle}</p>
              </div>
              <button className="ml-auto pr-1">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <PostsList posts={posts} />
          </>
        }
        aside={<Aside />}
      />
    );
  } catch (e) {
    return <div>ERROR</div>;
  }
}
