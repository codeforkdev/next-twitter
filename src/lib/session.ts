import { db } from "@/drizzle/db";
import { sessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getSession() {
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId) return;
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {
      id: true,
    },
    with: {
      user: true,
    },
  });

  return session;
}
