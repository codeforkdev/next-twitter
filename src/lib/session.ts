import db from "@/server/db";
import { sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export default async function getSession() {
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId) return undefined;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, ""),
    columns: {
      id: true,
    },
    with: {
      user: true,
    },
  });

  return session;
}
