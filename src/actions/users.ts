"use server";
import db from "@/server/db";
import { users } from "@/server/db/schema";
import { like, or } from "drizzle-orm";

export const searchUsers = async (term: string) => {
  const usersList = await db.query.users.findMany({
    where: or(
      like(users.handle, `%${term}%`),
      like(users.displayName, `%${term}%`),
    ),
  });

  return usersList;
};
