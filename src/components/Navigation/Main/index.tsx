import { cn } from "@/lib/utils";
import { user } from "@/mock-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const config = {
  links: {
    styles: { active: "text-sky-500", inactive: "text-red-500" },
  },
};

type MainLinkProps = {
  children: React.ReactNode;
  href: string;
};
function MainLink({ children, href }: MainLinkProps) {
  const pathname = usePathname();
  const styles =
    pathname === href
      ? config.links.styles.active
      : config.links.styles.inactive;
  return (
    <li>
      <Link href="/" className={cn(styles)}>
        {children}
      </Link>
    </li>
  );
}

export default function MainLinks() {
  const pathname = usePathname();
  const urls = ["/home", "/messges", "/bookmarks", "/" + user.handle];
  return (
    <div className="hidden lg:w-20 xl:w-72 h-full sm:flex flex-col">
      <ul className="flex flex-col">
        {urls.map((url) => {
          const label = url.endsWith(user.handle)
            ? "profile"
            : url.split("/")[1];
          return (
            <Link
              href={url}
              className={cn("capitalize", {
                "text-sky-500": pathname === url,
              })}
            >
              {label}
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

function activeLink(
  endpoint: string,
  config: { active: string; inactive: string }
) {
  const pathname = usePathname();
  const isActive = pathname === endpoint;

  return isActive ? config.active : config.inactive;
}
