"use server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import db from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { JWTPayload, JWTVerifyResult, SignJWT, jwtVerify } from "jose";
import { faker } from "@faker-js/faker";

const TOKEN_KEY = "jwt";

type UserNoPassword = Omit<typeof users.$inferSelect, "password">;

export async function getUser(): Promise<UserNoPassword | null> {
  const secret = process.env.JWT_SECRET as string;
  const response = await verifyJWT({ secret });
  if (!response.ok) {
    return null;
  }
  return response.jwt.payload.user;
}

export async function login({
  name,
  password,
}: {
  name: string;
  password: string;
}): Promise<{ ok: false; error: string } | { ok: true }> {
  const response = await findUser({ name, password });
  if (!response.ok) {
    return { ok: false, error: response.error };
  }
  const { user } = response;

  const token = await createToken({ user });
  await createSession({ token: token, userId: user.id });

  revalidatePath("/");
  return { ok: true };
}

export async function findUser({
  name,
  password,
}: {
  name: string;
  password: string;
}): Promise<{ ok: false; error: string } | { ok: true; user: UserNoPassword }> {
  try {
    const user = await db.query.users.findFirst({
      where: and(or(eq(users.email, name), eq(users.handle, name))),
    });

    if (!user) {
      return { ok: false, error: "User does not exist" };
    }

    if (user.password !== password) {
      return { ok: false, error: "Invalid credentials" };
    }

    const { password: _, ...userNoPassword } = user;
    return { ok: true, user: userNoPassword };
  } catch {
    return { ok: false, error: "Fatal DB Error" };
  }
}

export async function logout() {
  removeSession();
  revalidatePath("/");
}

export async function createToken({
  user,
}: {
  user: Required<UserNoPassword>;
}) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1 day")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return token;
}

export async function createSession({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) {
  const cookieStore = cookies();
  await db.insert(sessions).values({ userId, id: nanoid() });

  cookieStore.set(TOKEN_KEY, token, { httpOnly: true, path: "/" });

  cookies().set({
    name: TOKEN_KEY,
    value: token,
    httpOnly: true,
    path: "/",
  });
}

export async function removeSession() {
  const token = cookies().get(TOKEN_KEY)?.value;
  if (token) {
    cookies().delete(TOKEN_KEY);
    await db.delete(sessions).where(eq(sessions.id, token));
  }
}

export async function verifyJWT({
  secret,
}: {
  secret: string;
}): Promise<
  | { ok: false }
  | { ok: true; jwt: JWTVerifyResult<JWTPayload & { user: UserNoPassword }> }
> {
  if (!secret) {
    return { ok: false };
  }
  const token = cookies().get(TOKEN_KEY)?.value;

  if (!token) {
    return { ok: false };
  }

  try {
    const jwt = (await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    )) as JWTVerifyResult<JWTPayload & { user: UserNoPassword }>;

    return {
      ok: true,
      jwt,
    };
  } catch {
    return { ok: false };
  }
}

export async function signUp({
  handle,
  email,
  password,
}: {
  handle: string;
  email: string;
  password: string;
}) {
  const newUser = {
    id: nanoid(),
    handle,
    email,
    displayName: handle,
    avatar: faker.image.avatarGitHub(),
    password,
  } satisfies typeof users.$inferInsert;
  try {
    await db.insert(users).values(newUser);
    const user = await db.query.users.findFirst({
      where: eq(users.id, newUser.id),
    });
    if (!user) {
      return { ok: false };
    }

    const response = await login({
      name: user.handle,
      password: user.password,
    });

    if (!response.ok) {
      return response;
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Fatal DB Error",
    };
  }
}
