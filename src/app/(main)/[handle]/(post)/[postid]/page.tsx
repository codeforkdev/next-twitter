import { Avatar } from "@/app/_components/Avatar";
import { Spacer } from "@/app/_components/Spacer";
import { eq, sql } from "drizzle-orm";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import BackButton from "@/app/_components/BackButton";
import { nanoid } from "nanoid";
import db from "@/server/db";
import { MainLayout } from "@/app/_layouts/MainLayout";
import { views } from "@/server/db/schema";
import { verifyJWT } from "@/lib/auth";
import { broadcast } from "@/actions/posts";
import { getPosts } from "@/server/db/queries";
import PostsList from "@/app/_components/Post/PostsList";
import { idSchema } from "@/schemas";
import ParentPost from "./_components/ParentPost";
import PostReply from "./_components/PostReply";

export default async function Page({ params }: { params: { postid: string } }) {
  const {
    payload: { user },
  } = await verifyJWT();

  // insert view
  await db
    .insert(views)
    .values({ id: nanoid(), postId: params.postid, userId: user.id });

  const data = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(views)
    .where(eq(views.postId, params.postid));

  broadcast({
    party: "post",
    roomId: params.postid,
    data: { type: "views", data: data[0].count },
  });

  const targetPosts = await db.execute(
    sql.raw(`
      SELECT 
        posts.id
      FROM posts   
      WHERE parent_id = '${params.postid}' OR id = '${params.postid}'
      order by created_at asc
      `),
  );

  let [main, ...comments] = await getPosts({
    viewerId: user.id,
    postIds: idSchema.array().parse(targetPosts.rows),
  });

  return (
    <MainLayout
      main={
        <>
          <Header />
          <ParentPost {...main} />
          <Spacer className="my-4" />
          <div className="px-4">
            <PostReply postId={main.id} {...user} userId={user.id} />
          </div>
          <PostsList posts={comments} />
        </>
      }
      aside={<></>}
    />
  );
}

const Header = () => {
  return (
    <div
      className="sticky top-0 z-50 flex items-center gap-9 bg-black/70 px-4 py-3"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <BackButton>
        <ArrowLeft size={20} />
      </BackButton>

      <p className="text-xl font-semibold">Post</p>
    </div>
  );
};
