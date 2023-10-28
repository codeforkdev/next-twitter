import Post from "@/app/_components/Post/Post";
import { verifyJWT } from "@/lib/auth";
import db from "@/server/db";
import { ensureError } from "@/types";
import { ExecutedQuery } from "@planetscale/database";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const revalidate = true;

export default async function Home() {
  const {
    payload: { user },
  } = await verifyJWT();
  console.log(user);

  const userSchema = z.object({
    id: z.string(),
    avatar: z.string(),
    displayName: z.string(),
    // email: z.string().email(),
    // handle: z.string(),
    // joinedAt: z.coerce.date(),
  });

  const postSchema = z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    text: z.string(),
    createdAt: z.date(),
  });

  const postUserSchema = z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    text: z.string(),
    createdAt: z.coerce.date(),
    userId: z.string(),
    avatar: z.string(),
    displayName: z.string(),
    handle: z.string(),
  });

  const test = postSchema.extend({ author: userSchema });
  let result: ExecutedQuery;
  type PostSchema = z.infer<typeof postSchema>;
  type UserSchema = z.infer<typeof userSchema>;
  let posts: z.infer<typeof postUserSchema>[];
  try {
    result = await db.execute(
      sql`SELECT 
      posts.id, 
      posts.parent_id as 'parentId',
      posts.text,
      posts.created_at as 'createdAt',
      users.id as 'userId',
      users.avatar,
      users.display_name as 'displayName',
      users.handle
    FROM posts JOIN users on posts.user_id = users.id`,
    );

    try {
      posts = postUserSchema.array().parse(result.rows);
    } catch (err) {
      const error = ensureError(err);
      throw new Error("Unexpected result from db");
    }
  } catch (err) {
    const error = ensureError(err);
    throw new Error(error.message);
  }

  return (
    <ol>
      {posts.map((post) => {
        return (
          <li
            key={post.id}
            className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
          >
            <Post
              id={post.id}
              author={{
                id: post.userId,
                avatar: post.avatar,
                displayName: post.displayName,
                handle: post.handle,
              }}
            />
            {/* <Post
              id={post.id}
              authorId={post.userId}
              text={post.text}
              comments={10}
              liked={true}
              likes={5}
              bookmarked={true}
            /> */}
          </li>
        );
      })}
    </ol>
  );
}
