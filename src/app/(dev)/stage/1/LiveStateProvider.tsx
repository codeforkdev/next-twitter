"use client";
import React, { createContext } from "react";

type TContext = {
  sessionId: string;
  appId: string;
};

export const LiveStateContext = createContext<TContext>({
  sessionId: "",
  appId: "",
});

type Props = {
  children: React.ReactNode | React.ReactNode[];
  context: TContext;
};

export default function LiveStateProvider({ children, context }: Props) {
  return (
    <LiveStateContext.Provider value={{ ...context }}>
      {children}
    </LiveStateContext.Provider>
  );
}
