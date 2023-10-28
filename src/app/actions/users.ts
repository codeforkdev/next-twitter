"use server";
import { users } from "@/server/db/schema";
import { like, or } from "drizzle-orm";
import db from "../db/driver";

export const searchUsers = async (term: string) => {
  console.log(term);
  const usersList = await db.query.users.findMany({
    where: or(
      like(users.handle, `%${term}%`),
      like(users.displayName, `%${term}%`),
    ),
  });

  console.log(usersList);

  return usersList;
};
