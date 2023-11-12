import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  text: z.string(),
  createdAt: z.coerce.date(),
  authorId: z.string(),
  avatar: z.string(),
  displayName: z.string(),
  handle: z.string(),
  likes: z.coerce.number(),
  comments: z.coerce.number(),
  reposts: z.coerce.number(),
  views: z.coerce.number(),
  bookmarked: z.coerce.number().transform((val) => (val === 0 ? false : true)),
  liked: z.coerce.number().transform((val) => (val === 0 ? false : true)),
});
export type TPostSchema = z.infer<typeof postSchema>;

export const idSchema = z
  .object({
    id: z.string(),
  })
  .transform((val) => val.id);

export const messageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  text: z.string(),
  createdAt: z.coerce.date(),
  handle: z.string(),
  avatar: z.string(),
  displayName: z.string(),
});

export type TMessage = z.infer<typeof messageSchema>;
