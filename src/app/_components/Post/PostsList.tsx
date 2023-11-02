import { TPostSchema } from "@/schemas";
import Post from "./Post";

export default function PostsList({ posts }: { posts: TPostSchema[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.id}
          className="border-b border-white/20 px-4 py-3 transition-colors hover:bg-gray-700/10"
        >
          <Post
            {...post}
            author={{ ...post }}
            metrics={{ ...post }}
            viewer={{ ...post }}
          />
        </li>
      ))}
    </ul>
  );
}
