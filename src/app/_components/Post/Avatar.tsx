import Link from "next/link";
import { Avatar } from "../Avatar";

export default function PostAvatar({
  href,
  handle,
}: {
  href: string;
  handle: string;
}) {
  return (
    <Link
      href={"/" + handle}
      className="relative h-10 w-10 shrink-0 overflow-clip rounded-full"
      onClick={(e) => e.stopPropagation()}
    >
      <Avatar
        src={href ?? "https://avatars.githubusercontent.com/u/142317935?v=4"}
      />
    </Link>
  );
}
