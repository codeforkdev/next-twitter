"use client";
import { Avatar } from "@/components/Avatar";
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
        "flex p-5 gap-4 h-20 hover:bg-white/10 transition-colors  duration-200 border-r border-transparent",
        { "border-primary": pathname.endsWith(id) }
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
