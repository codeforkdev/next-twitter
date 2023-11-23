import { Avatar } from "@/app/_components/Avatar";
import BackButton from "@/app/_components/BackButton";
import { Spacer } from "@/app/_components/Spacer";
import { verifyJWT } from "@/lib/auth";
import db from "@/server/db";
import { verify } from "crypto";
import { sql } from "drizzle-orm";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

export default async function Page({ params }: { params: { id: string } }) {
  const {
    payload: { user },
  } = await verifyJWT();
  const schema = z.object({
    id: z.string(),
    displayName: z.string(),
    handle: z.string(),
    avatar: z.string(),
  });
  const participantsQuery = await db.execute(sql`
    SELECT u.id, display_name as displayName, handle, avatar
    FROM conversation_participants AS p
    JOIN users AS u ON p.user_id = u.id 
    WHERE conversation_id = ${params.id}
  `);

  const participants = schema.array().parse(participantsQuery.rows);

  return (
    <>
      <header className="border-b border-white/20 p-4">
        <div className="flex gap-6">
          <BackButton className="rounded-full p-1 hover:bg-white/10">
            <ArrowLeftIcon size={18} />
          </BackButton>
          <p className="font-semibold">Group Info</p>
        </div>
        <Spacer className="py-3" />
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            {participants.length}
          </div>
          <ul className="flex gap-2 text-sm">
            {participants.map((p, i) => {
              if (p.id === user.id) return;
              return (
                <li key={p.id}>
                  {p.displayName}
                  {i < participants.length - 1 &&
                    participants.length !== 2 &&
                    ", "}
                </li>
              );
            })}
          </ul>
        </div>
      </header>
      <div>
        <h3 className="p-4 font-bold">People</h3>
        <ul>
          {participants.map((p) => {
            if (p.id === user.id) return;
            return (
              <li key={p.id}>
                <Link
                  href={p.id}
                  className="flex w-full items-center gap-3 px-4 py-2 transition-colors hover:bg-white/10"
                >
                  <Avatar src={p.avatar} />
                  <div className="text-sm">
                    <div className="font-semibold">{p.displayName}</div>
                    <div className="text-[#65696e]">@{p.handle}</div>
                  </div>
                  <button className="ml-auto rounded-full border border-white/20 px-4 py-1.5 text-xs">
                    Following
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
        <button className="w-full py-3 text-center text-sm text-primary transition-colors hover:bg-primary/10">
          Add people
        </button>
      </div>

      <div className="flex flex-col gap-3 border-y border-white/20 p-4">
        <h3 className="font-bold">Notifications</h3>
        <div className="flex justify-between text-sm">
          <p>Snooze notifications</p>
          <button>toggle</button>
        </div>
        <div className="text-sm">
          <div className="flex justify-between">
            <p>Snooze mentions</p>
            <button>toggle</button>
          </div>

          <p className="text-[#65696e]">
            Disable notifications when people mention you in this conversation.
          </p>
        </div>
      </div>
      <Spacer className="pt-1" />
      <button className="w-full py-3 text-center text-sm text-primary transition-colors hover:bg-primary/10">
        Report conversation
      </button>
      <button className="w-full py-3 text-center text-sm text-red-500 transition-colors hover:bg-red-500/10">
        Leave conversation
      </button>
    </>
  );
}
