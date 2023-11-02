import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { sessions, users } from "@/drizzle/schema";
import { BaseError, ensureError } from "@/types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

class SessionStore implements ISessionStore {
  private readonly db = db;
  constructor() {}

  async newSession(credentials: Credentials): Promise<Result<Session>> {}

  async insertSession(params: insertSessionParams): Promise<Result<Session>> {
    const id = nanoid();
    try {
      return { success: true, result: session };
    } catch (err) {
      const error = ensureError(err);
      return {
        success: false,
        error: new BaseError("DB Error: Cannot insert into session", {
          cause: error,
          context: {
            id,
          },
        }),
      };
    }
  }
}

type insertSessionParams = { userId: string };

async function getSessionById(
  id: string,
): Promise<Result<Session | undefined>> {
  try {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, id),
    });

    return { success: true, result: session };
  } catch (err) {
    const error = ensureError(err);
    return { success: false, error };
  }
}

type getUserByCredsParams = Auth;
async function getUserByCreds(
  params: getUserByCredsParams,
): Promise<Result<UserSchema | undefined>> {}

type createSessionParams = Auth;
async function createUserSession(
  params: createSessionParams,
): Promise<Result<(Session & { user: UserSchemaNoPassword }) | undefined>> {}

async function getSession(id: string): Promise<Result<Session>> {
  try {
    const result = await db.query.sessions.findFirst({
      where: eq(sessions.id, id),
      with: {
        user: {
          columns: {
            password: false,
          },
        },
      },
    });

    return { success: true, result };
  } catch (err) {
    const error = ensureError(err);
    return { success: false, error };
  }
}
