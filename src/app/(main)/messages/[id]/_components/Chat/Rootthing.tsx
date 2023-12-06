// import { ChatContext } from "./ChatProvider";

export function Root() {
  return <div>Root</div>;
}
export function ioot<Message>({
  //   initialMessages,
  children, //   room,
  //   onSend,
} //   avatar,
: {
  //   room: string;
  //   initialMessages: Message[];
  //   avatar: string;
  //   onSend: ({ text }: { text: string }) => Message;
  children: React.ReactNode;
}) {
  //   const inputRef = useRef<HTMLInputElement>(null);
  //   const [messages, setMessages] = useState<Message[]>(initialMessages);
  //   const [typers, setTypers] = useState<{ connId: string; avatar: string }[]>(
  //     [],
  //   );
  //   const ws = usePartySocket({
  //     room,
  //     host: PKURL,
  //     party: "chatprovider",

  //     onMessage: (evt: MessageEvent) => {
  //       const json = JSON.parse(evt.data);
  //       const data = returningSchema.parse(json);
  //       console.log(data);
  //       switch (data.type) {
  //         case "message":
  //           console.log("message event");
  //           //   const message = messageSchema.parse(data.message);
  //           setMessages((prev) => [...prev, data.message]);
  //           break;
  //         case "typing":
  //           console.log("typing event");
  //           setTypers(() =>
  //             data.typers.filter((typer) => typer.connId !== ws.id),
  //           );
  //           break;
  //       }
  //     },
  //   });

  //   function sendValid(schema: z.infer<typeof sendingSchema>) {
  //     ws.send(JSON.stringify(schema));
  //   }

  //   async function sendMessage() {
  //     if (!inputRef.current) return;
  //     const cleanText = inputRef.current.value.trim();

  //     if (!cleanText) return;
  //     const message = await onSend({
  //       text: cleanText,
  //     });
  //     sendValid({ type: "message", message });
  //   }

  //   const typing = {
  //     start() {
  //       sendValid({
  //         type: "typing",
  //         avatar: avatar ?? "",
  //         typing: true,
  //       });
  //     },
  //     stop() {
  //       sendValid({ type: "typing", typing: false });
  //     },
  //   };
  return (
    <div>{children}</div>
    // <ChatContext.Provider
    //   value={{ typers, inputRef, sendMessage, typing, messages }}
    // >
    //   {children}
    // </ChatContext.Provider>
  );
}
