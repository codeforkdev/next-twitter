"use client";
import { useRouter } from "next/navigation";
import { user } from "@/mock-data";
import { toggleBookmark, toggleLike } from "@/app/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PostProps = {
  id: string;
  text: string;
  user: {
    id: string;
    handle: string;
  };
  isBookmarked: boolean;
  likes: { userId: string }[];
};
export default function Post({
  id,
  user,
  text,
  isBookmarked,
  likes,
}: PostProps) {
  const router = useRouter();
  const liked = likes.find((like) => like.userId === user.id);
  return (
    <div
      onClick={() => router.push(`/${user.handle}/${id}`)}
      className="p-2 cursor-pointer"
    >
      <div>
        <p>{id}</p>
        <Link
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
          href={"/" + user.handle}
        >
          {user.handle}
        </Link>
        <p>{text}</p>
        <div className="flex gap-4">
          <button
            className={cn({
              "bg-gray-500": !isBookmarked,
              "bg-green-500": isBookmarked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({ userId: user.id, postId: id, isBookmarked });
            }}
          >
            Bookmark
          </button>
          <button
            className={cn({
              "bg-gray-500": !liked,
              "bg-pink-500": liked,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike({
                userId: user.id,
                postId: id,
                isLiked: liked !== undefined,
              });
            }}
          >
            likes
          </button>
        </div>
      </div>
    </div>
  );
}
