"use server";

import db from "@/server/db";
import { users } from "@/server/db/schema";
import { and, eq, or } from "drizzle-orm";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";

type Result<T> = { success: true; data: T } | { success: false; error: string };

type LoginParams = { name: string; password: string };
export async function login(params: LoginParams): Promise<Result<{}>> {
  console.log("LOGGING IN ", params);
  let user: typeof users.$inferSelect | undefined;
  try {
    user = await db.query.users.findFirst({
      where: and(
        or(eq(users.email, params.name), eq(users.handle, params.name)),
      ),
    });
  } catch (err) {
    return { success: false, error: "Fatal DB Error" };
  }

  if (!user) {
    return { success: false, error: "User does not exist" };
  }

  if (user.password !== params.password) {
    return { success: false, error: "Invalid credentials" };
  }

  const cookieStore = cookies();
  const { password, ...rest } = user;
  try {
    const token = await new SignJWT({ user: rest })
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("1 day")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    cookieStore.set("jwt", token, { httpOnly: true, path: "/" });
  } catch (err) {
    return { success: false, error: "error" };
  }

  return { success: true, data: "" };
}
