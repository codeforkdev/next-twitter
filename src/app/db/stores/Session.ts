import { sessions, users } from "@/drizzle/schema";
import {
  AuthError,
  BaseError,
  Credentials,
  Result,
  ensureError,
} from "@/types";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import db from "../driver";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

type Session = typeof sessions.$inferSelect;

export const SessionSchema = createSelectSchema(sessions);
export type SessionSchema = z.infer<typeof SessionSchema>;

type CreateSessionReturnType = Promise<Result<Session, Error>>;

export async function createSession(
  credentials: Credentials,
): CreateSessionReturnType {
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, credentials.email),
      eq(users.password, credentials.password),
    ),
  });

  if (!user) {
    return { success: false, error: new AuthError("invalid credentials") };
  }

  // Create session for user
  const newSessionId = nanoid();
  await db.insert(sessions).values({ id: newSessionId, userId: user.id });
  const newSession = await db.query.sessions.findFirst({
    where: eq(sessions.id, newSessionId),
  });

  if (!newSession) {
    // this is debatable
    return { success: false, error: new BaseError("Failed to create session") };
    // throw new BaseError("Unable to find new session", {
    //   context: newSessionId,
    // });
  }

  cookies().set({
    name: "sessionId",
    value: newSession.id,
    httpOnly: true,
    path: "/",
  });

  return { success: true, result: newSession };
}
