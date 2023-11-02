import { sql } from "drizzle-orm";
import db from ".";
import { postSchema } from "@/schemas";

type TPostParams = {
  postId: string;
  viewerId: string;
};
export const getPostQuery = (params: TPostParams) => {
  const { postId, viewerId } = params;
  return sql.raw(
    `
        SELECT 
        *
        FROM (
          SELECT 
          'link' as link,
            id, 
            text, 
            parent_id as parentId,
            created_at as createdAt
            FROM posts WHERE id = '${postId}'
        ) as post 
        LEFT JOIN
        (
          SELECT 
          'link' as link,
         (SELECT count(*) as likes FROM likes WHERE post_id = '${postId}') as likes,
         (SELECT count(*) as views FROM post_views views WHERE post_id = '${postId}') as views,
         (SELECT count(*) as comments FROM posts WHERE parent_id = '${postId}') as comments,
         (SELECT count(*) as reposts FROM posts WHERE parent_id = '${postId}' AND repost = 1) as reposts
        ) as metrics ON post.link = metrics.link
        LEFT JOIN (
          SELECT 
          'link' as link,
            id as authorId,
            avatar,
            handle,
            display_name as displayName
          FROM users WHERE id = (select user_id from posts where id = '${postId}') 
        ) as author on author.link = metrics.link
        LEFT JOIN (
          SELECT 
            'link' as link,
            (SELECT count(*) as userLiked FROM likes WHERE post_id = '${postId}' and user_id = '${viewerId}') as liked,
            (SELECT count(*) as userbookmarked FROM bookmarks WHERE post_id = '${postId}' and user_id = '${viewerId}') as bookmarked  
          FROM users WHERE id = '${viewerId}'
        ) as viewer ON viewer.link = metrics.link
        `,
  );
};

export const getPosts = async (params: {
  viewerId: string;
  postIds: string[];
}) => {
  const { viewerId, postIds } = params;

  const sqlQuery = sql.empty();
  for (let i = 0; i < postIds.length; i++) {
    sqlQuery.append(
      getPostQuery({
        viewerId,
        postId: postIds[i],
      }),
    );
    if (i >= postIds.length - 1) continue;

    sqlQuery.append(sql.raw(`UNION`));
  }
  const posts = await db.execute(sqlQuery);

  return postSchema.array().parse(posts.rows);
};
