"use client";
import * as Dialog from "@radix-ui/react-dialog";

import { Plus, Search, Users, X } from "lucide-react";

export default function Page() {
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button>
            <Plus />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="bg-gray-700/30 z-50 fixed inset-0" />
          <Dialog.Content className="z-50 fixed left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 max-w-xl w-full bg-slate-950">
            <div className="flex items-center gap-10 p-4">
              <Dialog.Close>
                <X />
              </Dialog.Close>
              <p className="font-semibold text-xl">New Message</p>
              <button className="py-0.5 px-4 rounded-full bg-sky-500 ml-auto">
                Next
              </button>
            </div>

            <div className="flex py-2 px-4 gap-4">
              <Search size={20} />
              <input
                type="text"
                className="flex-1 bg-transparent"
                placeholder="Search people"
              />
            </div>
            <button className="border-y border-slate-700 flex items-center py-4 px-8 w-full gap-6 text-sky-500">
              <div className="border border-sky-200 rounded-full h-12 w-12 flex items-center justify-center">
                <Users size={20} />
              </div>
              <p>Create a group</p>
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <ul></ul>
    </div>
  );
}
