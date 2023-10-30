import usePartySocket from "partysocket/react";
import React, { createContext, useEffect } from "react";

export const ReactionContext = createContext(null);

export const ReactionProvider = ({
  postId,
  children,
}: {
  postId: string;
  children: React.ReactNode;
}) => {
  return (
    <ReactionContext.Provider value={null}>{children}</ReactionContext.Provider>
  );
};
