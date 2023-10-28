"use server";
import { Credentials, Result, ensureError } from "@/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import db from "../driver";
import { and, eq } from "drizzle-orm";
import { users } from "@/server/db/schema";

export const SelectUserSchema = createSelectSchema(users);
export const InsertUserSchema = createInsertSchema(users);
export type InsertUserSchema = z.infer<typeof InsertUserSchema>;
export type SelectUserSchema = z.infer<typeof SelectUserSchema>;
export type UserSchemaNoPassword = Omit<SelectUserSchema, "password">;
type getUserByCredentialsReturnType = Promise<
  Result<UserSchemaNoPassword | undefined>
>;

export interface IUserStore {
  getUserByCredentials: (
    credentials: Credentials,
  ) => getUserByCredentialsReturnType;
}

export const UserStore = {
  async getUserByCredentials(
    credentials: Credentials,
  ): getUserByCredentialsReturnType {
    const { email, password } = credentials;
    try {
      const user = await db.query.users.findFirst({
        where: and(eq(users.email, email), eq(users.password, password)),
        columns: {
          password: false,
        },
      });
      return { success: true, result: user };
    } catch (err) {
      const error = ensureError(err);
      return {
        success: false,
        error: new Error("Database error", { cause: error }),
      };
    }
  },
};
