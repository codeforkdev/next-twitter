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
        posts.id
      FROM bookmarks   
      LEFT JOIN posts ON bookmarks.post_id = posts.id
      WHERE bookmarks.user_id = ${user.id}
      `,
    );

    console.log(response.rows);

    const postIds = idSchema.array().parse(response.rows);

    if (postIds.length === 0) {
      return (
        <MainLayout
          main={
            <>
              <div className="flex flex-col">
                <div className="border-b border-white/20">
                  <p className="text-xl font-bold">Bookmarks</p>
                  <p className="text-xs text-gray-300/50">@{user.handle}</p>
                </div>
                <Spacer className="mt-[1.9rem]" />
                <div className="mx-auto flex max-w-sm flex-col gap-2 px-5">
                  <p className="text-3xl font-bold">Save posts for later</p>
                  <p className="text-sm text-gray-300/50">
                    Bookmark posts to easily find them again in the future.
                  </p>
                </div>
              </div>
            </>
          }
          aside={<Aside />}
        />
      );
    }

    const posts = await getPosts({ viewerId: user.id, postIds });

    return (
      <MainLayout
        main={
          <>
            <div className="flex border-b border-white/20 px-4 py-1.5">
              <div>
                <p className="text-xl font-bold">Bookmarks</p>
                <p className="text-xs text-gray-300/50">@{user.handle}</p>
              </div>
              <button className="ml-auto pr-1">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <PostsList userId={user.id} posts={posts} />
          </>
        }
        aside={<Aside />}
      />
    );
  } catch (e) {
    return <div>ERROR</div>;
  }
}
