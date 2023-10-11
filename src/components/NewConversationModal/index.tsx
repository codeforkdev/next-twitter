"use client";
import { createConversation, searchUsers } from "@/actions/actions";
import { useDebounce } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { user } from "@/mock/mock-data";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, MailPlusIcon, Plus, Search, Users, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
type User = {
  id: string;
  handle: string;
};
export default function NewConversationModal() {
  const [open, setOpen] = useState(false);
  const debounce = useDebounce();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  const addParticipant = (user: User) => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    setParticipants((prev) => [...prev, user]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((user) => user.id !== id));
  };

  const getParticipant = (id: string) => {
    return participants.find((p) => p.id === id);
  };

  const toggleParticipant = (user: User) => {
    const participant = getParticipant(user.id);
    participant ? removeParticipant(participant.id) : addParticipant(user);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget?.value ?? "";
    const cleanSearch = search.trim();
    if (!cleanSearch) {
      debounce.cancel();
      setFetchedUsers([]);
      return;
    }
    debounce.queue(async () => {
      setFetchedUsers(await searchUsers(cleanSearch));
    }, 200);
  };

  const handleCreateConversation = () => {
    if (participants.length === 0) return;
    const userIds = participants.map((p) => p.id);
    createConversation(user.id, userIds);
    setOpen(false);
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <MailPlusIcon size={20} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-500/30 z-50 fixed inset-0" />
        <Dialog.Content className="z-50 flex flex-col h-[650px] rounded-xl fixed left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 max-w-xl w-full bg-slate-950">
          <div className="flex items-center gap-10 p-4">
            <Dialog.Close>
              <X />
            </Dialog.Close>
            <p className="font-semibold text-xl">New Message</p>
            <button
              disabled={participants.length === 0}
              onClick={handleCreateConversation}
              className="py-0.5 px-4 font-semibold disabled:bg-sky-500/50 rounded-full bg-sky-500 ml-auto text-sm"
            >
              create
            </button>
          </div>

          <div className="border-b flex flex-col gap-4 py-2">
            <div className="flex px-4 gap-4">
              <Search size={20} />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none"
                placeholder="Search people"
                onChange={handleInput}
              />
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 border-slate-300 border-t-sky-400 animate-spin",
                  {
                    "opacity-100": debounce.isRunning,
                    "opacity-0": !debounce.isRunning,
                  }
                )}
              />
            </div>
            <ul className="px-4 flex flex-wrap gap-2">
              {participants.map((user) => {
                return (
                  <li key={user.id}>
                    <button
                      className="py-1 px-2 border rounded-full text-sm hover:bg-slate-800/70 transition-colors"
                      onClick={() => toggleParticipant(user)}
                    >
                      {user.handle}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {participants.length === 0 && (
            <button className="border-y border-slate-700 flex items-center py-4 px-8 w-full gap-6 text-sky-500">
              <div className="border border-sky-200 rounded-full h-12 w-12 flex items-center justify-center">
                <Users size={20} />
              </div>
              <p>Create a group</p>
            </button>
          )}

          <ul className="flex-1 overflow-y-auto">
            {fetchedUsers.map((user) => {
              const isParticipant = getParticipant(user.id) ? true : false;
              return (
                <li key={user.id}>
                  <button
                    onClick={() => toggleParticipant(user)}
                    className="w-full text-left p-4 hover:bg-slate-900/70"
                  >
                    <div className="flex justify-between">
                      {user.handle}

                      {isParticipant && <Check className="text-sky-500" />}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
