import { cn } from "@/lib/utils";
import { conversationParticipants } from "@/server/db/schema";

type MessageProps = {
  children: React.ReactNode;
  participant: typeof conversationParticipants.$inferSelect;
  userId: string;
};

export const Message = (props: MessageProps) => {
  const isMe = props.userId === props.participant.userId;

  return (
    <li
      className={cn("flex w-full", {
        "justify-end": isMe,
      })}
    >
      <div
        className={cn("flex max-w-[75%] flex-col ", {
          "items-end": isMe,
        })}
      >
        <div
          className={cn("flex max-w-[75%] rounded-2xl p-2", {
            "rounded-bl-sm bg-neutral-600": !isMe,
            "rounded-bl-0 justify-end rounded-br-sm border-blue-500 bg-blue-500":
              isMe,
          })}
        >
          <span>{props.children}</span>
        </div>
        <div className="text-xs">Yesterday 1:38pm</div>
      </div>
    </li>
  );
};
