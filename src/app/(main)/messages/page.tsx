import { Spacer } from "@/app/_components/Spacer";
import NewConversationModal from "./_components/NewConversationModal";
import ConversationListContainer from "./_components/ConversationListContainer";
import { getUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/");
  return (
    <div className={"h-full flex-col items-center justify-center laptop:flex"}>
      <div className="max-w-sm gap-2">
        <p className="text-3xl font-bold">Select a message</p>
        <Spacer className="my-2" />
        <p className="text-sm text-white/50">
          Choose from your existing conversations, start a new one, or just keep
          swimming.
        </p>
        <Spacer className="my-8" />
        <NewConversationModal userId={user.id}>
          <button className="rounded-full bg-primary px-6 py-3 font-semibold text-white">
            New message
          </button>
        </NewConversationModal>
      </div>
    </div>
  );
}
