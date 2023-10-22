import React, { createContext } from "react";

export const User = createContext();

export function UserProvider({ children }: { children: React.ReactNode }) {
  return <User.Provider value={null}>{children}</User.Provider>;
}
