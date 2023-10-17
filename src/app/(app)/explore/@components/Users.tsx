import { users } from "../../../../drizzle/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type User = typeof users.$inferSelect;

export const Users = ({ users, show }: { users: User[]; show: boolean }) => {
  return (
    <ul className={cn({ hidden: !show, block: show })}>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={"/" + user.handle}>
            <article className="flex gap-4 px-5 py-3">
              <div className="relative h-10 w-10 overflow-clip rounded-full">
                <Image src={user.avatar ?? ""} alt="avatar" fill />
              </div>

              <div>
                <p className="font-bold">{user.displayName}</p>
                <p>@{user.handle}</p>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
};
