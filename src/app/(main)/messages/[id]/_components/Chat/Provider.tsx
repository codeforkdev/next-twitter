import { createContext } from "react";

export const ChatContext = createContext({
  conversationId: "",
  participantId: "",
  avatar: "",
});

export function ChatProvider(props: {
  children: React.ReactNode;
  conversationId: string;
  participantId: string;
  avatar: string;
}) {
  const { children, ...rest } = props;
  return (
    <ChatContext.Provider value={{ ...rest }}>{children}</ChatContext.Provider>
  );
}
