import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Tabs() {
  const pathname = usePathname();
  return (
    <ul className="flex justify-around text-sm">
      <li
        className={cn("text-gray-400", {
          "text-white font-semibole border-b-2 border-primary":
            pathname === "/explore/tabs/for-you" || pathname === "/explore",
        })}
      >
        <Link href="/explore/tabs/for-you">For you</Link>
      </li>
      <li
        className={cn("text-gray-400 border-b-2  pb-4 border-transparent ", {
          "text-white font-semibold  border-primary":
            pathname === "/explore/tabs/trending",
        })}
      >
        <Link href="/explore/tabs/trending">Trending</Link>
      </li>
      <li
        className={cn(
          "text-gray-400 font-semibold border-b-2 border-transparent",
          {
            "text-white font-semibole border-b-2 border-primary":
              pathname === "/explore/tabs/news",
          }
        )}
      >
        <Link href="/explore/tabs/news">News</Link>
      </li>
      <li
        className={cn("text-gray-400", {
          "text-white font-semibole border-b-2 border-primary":
            pathname === "/explore/tabs/sports",
        })}
      >
        <Link href="/explore/tabs/sports">Sports</Link>
      </li>
    </ul>
  );
}
