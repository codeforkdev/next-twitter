import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Input } from "@/app/(auth)/login/_components/CredentialAuth";
import { ChevronDown, PlusIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PollForm({ close }: { close: () => void }) {
  const [activeDD, setActiveDD] = useState<string | null>(null);

  return (
    <div className="  rounded-xl border border-neutral-700">
      <div className="flex gap-2 border-b border-white/20 p-2">
        <div className="flex flex-1 flex-col gap-2">
          <Input
            placeholder="Choice 1"
            onInput={() => {}}
            error={false}
            containerStyles="rounded-lg"
            placeholderStyles="text-neutral-400"
          />
          <Input
            placeholder="Choice 2"
            onInput={() => {}}
            error={false}
            containerStyles="rounded-lg"
            placeholderStyles="text-neutral-400"
          />
        </div>
        <button className="mb-4 h-5 w-5 self-end rounded-full">
          <PlusIcon size={20} className="stroke-primary" />
        </button>
      </div>

      <div className="flex flex-col gap-1 border-b border-neutral-700 p-2">
        <p className="text-sm">Poll length</p>
        <div className="flex gap-2">
          <Dropdown.Root
            onOpenChange={(open) => {
              open ? setActiveDD("days") : setActiveDD(null);
            }}
          >
            <Dropdown.Trigger
              className={cn(
                "flex flex-1 justify-between rounded-lg border border-white/20 p-1.5 ",
                {
                  "border-primary": activeDD === "days",
                },
              )}
            >
              <div className="flex flex-col gap-1 text-sm">
                <p
                  className={cn("text-neutral-400", {
                    "text-primary": activeDD === "days",
                  })}
                >
                  Days
                </p>
                <p className="text-left">1</p>
              </div>
              <ChevronDown
                size={20}
                className="self-center stroke-neutral-400"
              />
            </Dropdown.Trigger>

            <Dropdown.Portal>
              <Dropdown.Content className="w-[180px] rounded-lg border border-neutral-700 bg-black text-white">
                {new Array(7).fill(null).map((_, i) => (
                  <Dropdown.DropdownMenuItem className="px-2 hover:bg-primary">
                    {i + 1}
                  </Dropdown.DropdownMenuItem>
                ))}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
          <Dropdown.Root
            onOpenChange={(open) => {
              open ? setActiveDD("hours") : setActiveDD(null);
            }}
          >
            <Dropdown.Trigger
              className={cn(
                "flex flex-1 justify-between rounded-lg border border-white/20 p-1.5 ",
                {
                  "border-primary": activeDD === "hours",
                },
              )}
            >
              <div className="flex flex-col gap-1 text-sm">
                <p
                  className={cn("text-neutral-400", {
                    "text-primary": activeDD === "hours",
                  })}
                >
                  Hours
                </p>
                <p className="text-left">1</p>
              </div>
              <ChevronDown
                size={20}
                className="self-center stroke-neutral-400"
              />
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content className="max-h-[300px] w-[180px] overflow-y-scroll rounded-lg border border-neutral-700 bg-black text-white">
                {new Array(23).fill(null).map((_, i) => (
                  <Dropdown.DropdownMenuItem className="px-2 hover:bg-primary">
                    {i + 1}
                  </Dropdown.DropdownMenuItem>
                ))}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>

          <Dropdown.Root
            onOpenChange={(open) => {
              open ? setActiveDD("minutes") : setActiveDD(null);
            }}
          >
            <Dropdown.Trigger
              className={cn(
                "flex flex-1 justify-between rounded-lg border border-white/20 p-1.5 ",
                {
                  "border-primary": activeDD === "minutes",
                },
              )}
            >
              <div className="flex flex-col gap-1 text-sm">
                <p
                  className={cn("text-neutral-400", {
                    "text-primary": activeDD === "minutes",
                  })}
                >
                  Minutes
                </p>
                <p className="text-left">1</p>
              </div>
              <ChevronDown
                size={20}
                className="self-center stroke-neutral-400"
              />
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Content className="max-h-[300px] w-[180px] overflow-y-scroll rounded-lg border border-neutral-700 bg-black text-white">
                {new Array(59).fill(null).map((_, i) => (
                  <Dropdown.DropdownMenuItem className="px-2 hover:bg-primary">
                    {i + 1}
                  </Dropdown.DropdownMenuItem>
                ))}
              </Dropdown.Content>
            </Dropdown.Portal>
          </Dropdown.Root>
        </div>
      </div>
      <button
        onClick={close}
        className="w-full py-4 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        Remove poll
      </button>
    </div>
  );
}
