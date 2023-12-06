"use client";

import Root from "./Root";

// import {
//   FormEvent,
//   RefObject,
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { returningSchema, sendingSchema } from "@/server/party/chatprovider";
// import { z } from "zod";
// import { PKURL } from "@/app/_components/Post/constants";
// import usePartySocket from "partysocket/react";
// import { cn } from "@/lib/utils";
// import { Avatar } from "@/app/_components/Avatar";
// import Input from "./Input";
// import Trigger from "./Trigger";
// import Typers from "./Typers";
import Messages from "./Messages";
import Scrollable from "./Scollable";

// export default { Root, Input, Trigger, Typers, Messages, Scrollable };
export { Root, Scrollable, Messages };

// export default function createChat<T extends z.Schema, M>({
//   messageSchema,
//   avatar,
//   room,
//   onSend,
//   messages,
// }: {
//   messages: M;
//   avatar?: string;
//   onSend: ({ text }: { text: string }) => Promise<z.TypeOf<T>>;
//   room: string;
//   messageSchema: T;
// }) {
//   // type Message = z.infer<typeof messageSchema>;
//   type Message = M;
//   type TChatContext = {
//     messages: Message[];
//     inputRef: RefObject<HTMLInputElement>;
//     typers: { connId: string; avatar: string }[];
//     sendMessage: () => void;
//     typing: {
//       start: () => void;
//       stop: () => void;
//     };
//   };
//   const ChatContext = createContext({} as TChatContext);

//   function Root({ children }: { children: React.ReactNode }) {
//     const inputRef = useRef<HTMLInputElement>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [typers, setTypers] = useState<{ connId: string; avatar: string }[]>(
//       [],
//     );
//     const ws = usePartySocket({
//       room,
//       host: PKURL,
//       party: "chatprovider",

//       onMessage: (evt: MessageEvent) => {
//         const json = JSON.parse(evt.data);
//         const data = returningSchema.parse(json);
//         console.log(data);
//         switch (data.type) {
//           case "message":
//             console.log("message event");
//             const message = messageSchema.parse(data.message);
//             setMessages((prev) => [...prev, message]);
//             break;
//           case "typing":
//             console.log("typing event");
//             setTypers(() =>
//               data.typers.filter((typer) => typer.connId !== ws.id),
//             );
//             break;
//         }
//       },
//     });

//     function sendValid(schema: z.infer<typeof sendingSchema>) {
//       ws.send(JSON.stringify(schema));
//     }

//     async function sendMessage() {
//       if (!inputRef.current) return;
//       const cleanText = inputRef.current.value.trim();

//       if (!cleanText) return;
//       const message = await onSend({
//         text: cleanText,
//       });
//       sendValid({ type: "message", message });
//     }

//     const typing = {
//       start() {
//         sendValid({
//           type: "typing",
//           avatar: avatar ?? "",
//           typing: true,
//         });
//       },
//       stop() {
//         sendValid({ type: "typing", typing: false });
//       },
//     };
//     return (
//       <ChatContext.Provider
//         value={{ typers, inputRef, sendMessage, typing, messages }}
//       >
//         {children}
//       </ChatContext.Provider>
//     );
//   }

//   type InputProps = React.ButtonHTMLAttributes<HTMLInputElement> & {
//     typingTimeout: number;
//   };

//   function Input(props: InputProps) {
//     const { typingTimeout, ...inputProps } = props;
//     const isTyping = useRef<boolean>(false);
//     const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
//     const { sendMessage, inputRef, typing } = useContext(ChatContext);

//     const handleEnter = () => {
//       sendMessage();
//     };

//     const handleInput = (e: FormEvent<HTMLInputElement>) => {
//       if (e.currentTarget.value) {
//         if (!isTyping.current) {
//           isTyping.current = true;
//           typing.start();
//           timeoutIdRef.current = setTimeout(() => {
//             typing.stop();
//             isTyping.current = false;
//             timeoutIdRef.current = null;
//           }, props.typingTimeout);
//           return;
//         }

//         if (timeoutIdRef.current) {
//           clearTimeout(timeoutIdRef.current);
//           timeoutIdRef.current = setTimeout(() => {
//             typing.stop();
//             isTyping.current = false;
//             timeoutIdRef.current = null;
//           }, props.typingTimeout);
//         }
//       }
//     };

//     return (
//       <input
//         {...inputProps}
//         className={cn(props.className)}
//         ref={inputRef}
//         onInput={handleInput}
//         onKeyUp={(e) => e.key === "Enter" && handleEnter()}
//       />
//     );
//   }

//   function Scrollable({
//     windowClass,
//     thumbClass,
//     trackClass,
//     children,
//   }: {
//     windowClass?: string;
//     thumbClass?: string;
//     trackClass?: string;
//     children: React.ReactNode | React.ReactNode[];
//   }) {
//     const { messages } = useContext(ChatContext);
//     const container = useRef<HTMLDivElement>(null);
//     const bottom = useRef<HTMLDivElement>(null);
//     const top = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//       // move scroll position to the bottom when a new message comes in and the user is near the bottom
//       if (messages.length === 0) return;
//       const newMessageEl = document.getElementById(
//         messages[messages.length - 1].id,
//       );
//       if (!bottom.current || !container.current || !newMessageEl) return;

//       const { clientHeight, scrollTop, scrollHeight } = container.current;
//       if (
//         scrollHeight - clientHeight - scrollTop <
//         newMessageEl.clientHeight + 10
//       )
//         bottom.current.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//       <ScrollArea.Root
//         type="auto"
//         className={cn("flex-1 overflow-hidden", windowClass)}
//       >
//         <ScrollArea.Viewport
//           className="flex h-full flex-col gap-2 py-4 pl-2 pr-5"
//           ref={container}
//         >
//           <div className="flex h-full flex-col gap-2 ">
//             <div ref={top} />
//             {children}
//             <div ref={bottom} />
//           </div>
//         </ScrollArea.Viewport>
//         <ScrollArea.Scrollbar
//           className={cn("h-full w-3 bg-white/30", trackClass)}
//         >
//           <ScrollArea.Thumb
//             className={cn("w-full rounded-full bg-gray-500", thumbClass)}
//           />
//         </ScrollArea.Scrollbar>
//       </ScrollArea.Root>
//     );
//   }

//   type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
//   function Trigger(props: TriggerProps) {
//     const { sendMessage } = useContext(ChatContext);
//     return (
//       <button
//         {...props}
//         onClick={(e) => {
//           if (props.onClick) props.onClick(e);
//           sendMessage();
//         }}
//       ></button>
//     );
//   }
//   function Typers() {
//     const { typers } = useContext(ChatContext);
//     return (
//       <>
//         {typers.map((typer) => (
//           <span key={typer.connId}>
//             <Avatar src={typer.avatar} />
//           </span>
//         ))}
//       </>
//     );
//   }

//   function Messages({
//     children,
//   }: {
//     children: (m: Message) => React.ReactNode;
//   }) {
//     const { messages } = useContext(ChatContext);

//     return <>{messages.map((message) => children(message))}</>;
//   }

//   return { Root, Input, Scrollable, Trigger, Typers, Messages };
// }
