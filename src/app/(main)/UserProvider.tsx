"use client";
import { users } from "@/server/db/schema";
import React, { createContext } from "react";
type UserSchemaNoPassword = Omit<typeof users.$inferSelect, "password">;
export const UserContext = createContext<UserSchemaNoPassword>(
  {} as UserSchemaNoPassword,
);

export const UserProvider = ({
  user,
  children,
}: {
  user: UserSchemaNoPassword;
  children: React.ReactNode;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
