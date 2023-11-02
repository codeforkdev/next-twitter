"use client";
import { UserSchemaNoPassword } from "@/app/db/stores/User";
import React, { createContext } from "react";

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
