import { users } from "@/drizzle/schema";
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
            <article className="py-3 px-5 flex gap-4">
              <div className="h-10 w-10 rounded-full overflow-clip relative">
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
