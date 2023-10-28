import React, { createContext } from "react";

const SearchContext = createContext(null);

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  <SearchContext.Provider value={null}>{children}</SearchContext.Provider>;
};
