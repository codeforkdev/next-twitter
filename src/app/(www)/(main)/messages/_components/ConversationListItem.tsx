"use client";
import { Avatar } from "@/app/_components/Avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  id: string;
  avatar: string;
  displayName: string;
};
export default function ConversationListItem({
  id,
  avatar,
  displayName,
}: Props) {
  const pathname = usePathname();
  return (
    <Link
      href={"/messages/" + id}
      className={cn(
        "flex  items-center gap-4 border-r border-transparent px-5 py-3  transition-colors duration-200 hover:bg-white/10",
        { "border-primary bg-white/10": pathname.endsWith(id) },
      )}
    >
      <Avatar src={avatar} />
      <div className="flex-1">
        <p>{displayName}</p>
        <p>hello there</p>
      </div>
    </Link>
  );
}
