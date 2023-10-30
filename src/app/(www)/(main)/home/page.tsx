import { Root as Post } from "@/app/_components/Post";
import { Reactions } from "@/app/_components/Post/Reactions";
import { verifyJWT } from "@/lib/auth";
import db from "@/server/db";
import { ensureError } from "@/types";
import { ExecutedQuery } from "@planetscale/database";
import { sql } from "drizzle-orm";
import { validateHeaderName } from "http";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  avatar: z.string(),
  displayName: z.string(),
  // email: z.string().email(),
  // handle: z.string(),
  // joinedAt: z.coerce.date(),
});

export const postSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  text: z.string(),
  createdAt: z.coerce.date(),
});

export const postUserSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  text: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  avatar: z.string(),
  displayName: z.string(),
  handle: z.string(),
  likes: z.coerce.number(),
  views: z.coerce.number(),
  bookmarked: z.coerce.number().transform((val) => (val === 0 ? false : true)),
  liked: z.coerce.number().transform((val) => (val === 0 ? false : true)),
});

export default async function Home() {
  const {
    payload: { user },
  } = await verifyJWT();
  console.log(user);

  let result: ExecutedQuery;
  let posts: z.infer<typeof postUserSchema>[];
  try {
    result = await db.execute(
      sql`
      SELECT 
      posts.id, 
      posts.parent_id as 'parentId',
      posts.text,
      posts.created_at as 'createdAt',
      users.id as 'userId',
      users.avatar,
      users.display_name as 'displayName',
      users.handle,
      count(likes.post_id) as likes,
      count(post_views.post_id) as views,
      count(bu.post_id) as bookmarked,
      count(lm.post_id) as liked
    FROM posts JOIN users on posts.user_id = users.id
    LEFT JOIN likes on posts.id = likes.post_id
    LEFT JOIN post_views on posts.id = post_views.post_id 
    LEFT JOIN (SELECT post_id FROM bookmarks WHERE bookmarks.user_id = ${user.id}) as bu on bu.post_id = posts.id
    LEFT JOIN (SELECT post_id FROM likes WHERE likes.user_id = ${user.id}) as lm on lm.post_id = posts.id
    GROUP BY posts.id
    `,
    );

    try {
      posts = postUserSchema.array().parse(result.rows);
      console.log(posts);
    } catch (err) {
      const error = ensureError(err);
      throw new Error(error.message, { cause: error });
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
            className="border-b border-white/20 px-4 pt-3 transition-colors hover:bg-gray-700/10"
          >
            <Post
              id={post.id}
              text={post.text}
              viewer={{
                bookmarked: post.bookmarked,
                liked: post.liked,
              }}
              metrics={{
                likes: post.likes,
                comments: 0,
                views: post.views,
                reposts: 0,
              }}
              author={{
                id: post.userId,
                avatar: post.avatar,
                displayName: post.displayName,
                handle: post.handle,
              }}
            />
          </li>
        );
      })}
    </ol>
  );
}
