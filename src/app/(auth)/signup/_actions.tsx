"use server";

import db from "@/server/db";
import { users } from "@/server/db/schema";

export async function CreateHandleDisplayName(params: {
  handle: string;
  email: string;
  displayName: string;
}) {
  await db.insert(users).values({});
}
