"use client";
import { useDebounce } from "@/app/hooks/hooks";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, MailPlusIcon, Plus, SearchIcon, Users, X } from "lucide-react";
import React, { ChangeEvent, useContext, useRef, useState } from "react";
import { Avatar } from "@/app/_components/Avatar";
import { createConversation } from "@/app/actions/conversation";
import { searchUsers } from "@/app/actions/users";
import { UserSchemaNoPassword } from "@/app/db/stores/User";
import { UserContext } from "../../UserProvider";

export default function NewConversationModal({
  children,
  userId,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const user = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [fetchedUsers, setFetchedUsers] = useState<UserSchemaNoPassword[]>([]);
  const [participants, setParticipants] = useState<UserSchemaNoPassword[]>([]);

  const addParticipant = (user: UserSchemaNoPassword) => {
    // if (inputRef.current) {
    //   inputRef.current.value = "";
    //   inputRef.current.focus();
    // }

    setParticipants((prev) => [...prev, user]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((user) => user.id !== id));
  };

  const toggleParticipant = (user: UserSchemaNoPassword) => {
    const participant = participants.find((p) => p.id === user.id);
    participant ? removeParticipant(participant.id) : addParticipant(user);
  };

  const handleCreateConversation = () => {
    if (participants.length === 0) return;
    const userIds = participants.map((p) => p.id);
    createConversation(userId, userIds);
    setOpen(false);
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-400/30" />
        <Dialog.Content className="fixed left-1/2 top-[50%] z-50 flex h-[660px] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-black">
          <div className="flex items-center gap-[36px]  p-4 pt-3">
            <Dialog.Close>
              <X size={20} />
            </Dialog.Close>
            <p className="text-xl font-semibold">New Message</p>
            <button
              disabled={participants.length === 0}
              onClick={handleCreateConversation}
              className="ml-auto rounded-full bg-sky-500 px-4 py-0.5 text-sm font-semibold disabled:bg-sky-500/50"
            >
              create
            </button>
          </div>

          <Search onListChange={setFetchedUsers} />
          <InviteList users={participants} onUserClick={toggleParticipant} />
          <CreateGroupButton numOfParticipants={participants.length} />
          <SearchUserList
            users={fetchedUsers}
            participants={participants}
            onUserClick={toggleParticipant}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Search({
  onListChange,
}: {
  onListChange: (users: UserSchemaNoPassword[]) => void;
}) {
  const debounce = useDebounce();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget?.value ?? "";
    const cleanSearch = search.trim();
    if (!cleanSearch) {
      debounce.cancel();
      onListChange([]);
      // setFetchedUsers([]);
      return;
    }
    debounce.queue(async () => {
      // setFetchedUsers(await searchUsers(cleanSearch));
      onListChange(await searchUsers(cleanSearch));
    }, 200);
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center gap-4 px-4">
        <SearchIcon size={18} className="text-white/40" />
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none placeholder:text-white/30"
          placeholder="Search people"
          onChange={handleInput}
        />
        <div
          className={cn(
            "h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-sky-400",
            {
              "opacity-100": debounce.isRunning,
              "opacity-0": !debounce.isRunning,
            },
          )}
        />
      </div>
    </div>
  );
}

function InviteList({
  onUserClick,
  users,
}: {
  onUserClick: (user: UserSchemaNoPassword) => void;
  users: UserSchemaNoPassword[];
}) {
  if (users.length !== 0) {
    return (
      <>
        <ul className="flex flex-wrap gap-2 border-b border-white/20 px-4 py-2">
          {users.map((user) => {
            return (
              <li key={user.id}>
                <button
                  className="rounded-full border px-2 py-1 text-sm transition-colors hover:bg-slate-800/70"
                  onClick={() => onUserClick(user)}
                >
                  {user.handle}
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}

function SearchUserList({
  participants,
  users,
  onUserClick,
}: {
  participants: UserSchemaNoPassword[];
  users: UserSchemaNoPassword[];
  onUserClick: (user: UserSchemaNoPassword) => void;
}) {
  return (
    <ul className="flex-1 overflow-y-auto">
      {users?.map((user) => {
        const isParticipant = participants.find((p) => p.id === user.id)
          ? true
          : false;

        return (
          <li key={user.id}>
            <button
              onClick={() => onUserClick(user)}
              className="w-full p-4 text-left hover:bg-slate-900/70"
            >
              <div className="flex gap-4">
                <Avatar className="h-10 w-10" src={user.avatar ?? ""} />
                <div className="flex flex-col">{user.handle}</div>

                {isParticipant && <Check className="ml-auto text-sky-500" />}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CreateGroupButton({
  numOfParticipants,
}: {
  numOfParticipants: number;
}) {
  const show = numOfParticipants === 0;
  if (show) {
    return (
      <button className="flex w-full items-center gap-6 border-y border-white/20 px-4 py-[14px] text-sky-500">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/40">
          <Users size={16} />
        </div>
        <p>Create a group</p>
      </button>
    );
  }
}
