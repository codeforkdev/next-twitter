import { cn } from "@/lib/utils";
import { MailPlusIcon, SearchIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import ConversationsList from "./_components/ConversationsList";
import { Spacer } from "@/app/_components/Spacer";
import NewConversationModal from "./_components/NewConversationModal";
import { verifyJWT } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    payload: { user },
  } = await verifyJWT();

  return (
    <div className={cn("flex w-full")}>
      <div className="w-[390px] border-r border-white/20">
        <ConversationsHeader userId={user.id} />
        <Spacer className="my-2" />
        <Search />
        <Spacer className="my-2" />
        <ConversationsList userId={user.id} />
      </div>

      {/* <Conversations conversations={conversations} /> */}
      <div className="flex-1 border-r border-r-white/20">{children}</div>
    </div>
  );
}

const Search = () => {
  return (
    <div className="px-4">
      <div className="relative flex items-center gap-1 rounded-full border  border-white/20 p-2 px-3">
        <SearchIcon size={16} className="text-white/40" />
        <input
          type="text"
          placeholder="Search Direct Messaes"
          className="flex-1 bg-transparent outline-none placeholder:text-sm placeholder:text-white/40"
        />
      </div>
    </div>
  );
};

const ConversationsHeader = ({ userId }: { userId: string }) => {
  return (
    <div className="flex items-center gap-4 p-4 pt-3">
      <p className="text-white/200 mr-auto text-xl font-semibold">Messages</p>
      <SettingsButton />
      <NewConversationModal userId={userId}>
        <button>
          <MailPlusIcon size={20} />
        </button>
      </NewConversationModal>
    </div>
  );
};

const SettingsButton = () => {
  return (
    <Link href="/messages/settings">
      <SettingsIcon size={20} />
    </Link>
  );
};
