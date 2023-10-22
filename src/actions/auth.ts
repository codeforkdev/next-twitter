"use server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { db } from "@/drizzle/db";
import { sessions } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { revalidate } from "@/app/(app)/home/page";
import { revalidatePath } from "next/cache";

export const login = async (params: { userId: string }) => {
  const id = nanoid();
  try {
    await db.insert(sessions).values({ id, userId: params.userId });
    cookies().set({
      name: "sessionId",
      value: id,
      httpOnly: true,
      path: "/",
    });
    redirect("/home");
  } catch (error) {
    console.log("Fatal error: unable to login");
  }
};

export const logout = async () => {
  const sessionId = cookies().get("sessionId")?.value;
  if (!sessionId) redirect("/");
  try {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  } catch (e) {
    console.log("unable to delete session");
  }
  cookies().delete("sessionId");
  revalidatePath("/");
};

export const removeSessionCookie = async () => {
  cookies().delete("sessionId");
};
