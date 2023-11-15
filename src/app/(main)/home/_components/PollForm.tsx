import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Input } from "@/app/(auth)/login/_components/CredentialAuth";
import { ChevronDown, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  options: z
    .object({
      value: z.string().min(1, { message: "Required" }),
    })
    .array(),
});

type Schema = z.infer<typeof schema>;

export default function PollForm({ close }: { close: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      options: [{ value: "" }, { value: "" }],
    },
  });
  const [activeDD, setActiveDD] = useState<string | null>(null);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "options",
      keyName: "id",
    },
  );

  return (
    <div
      className="rounded-xl border border-neutral-700"
      onClick={(e) => e.preventDefault()}
    >
      <div className="flex gap-2 border-b border-white/20 p-4">
        <div className="flex flex-1 flex-col gap-2">
          {fields.map((f, index) => (
            <div className="flex items-center" key={f.id}>
              <Input
                containerStyles="rounded-lg flex-1"
                placeholderStyles="text-neutral-400"
                error={false}
                onInput={() => {}}
                placeholder={`Option ${index + 1} ${
                  index > 1 ? "(optional)" : ""
                }`}
                onClick={(e) => e.preventDefault()}
              />
            </div>
          ))}
          {fields.length < 4 && (
            <button
              onClick={() => append({ value: "" })}
              className="my-2 w-full self-end rounded-lg border border-primary py-2 text-primary disabled:border-primary/30 disabled:text-primary/30"
            >
              Add option
            </button>
          )}
        </div>
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
                  <Dropdown.DropdownMenuItem
                    key={i}
                    className="px-2 hover:bg-primary"
                  >
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
                  <Dropdown.DropdownMenuItem
                    key={i}
                    className="px-2 hover:bg-primary"
                  >
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
                  <Dropdown.DropdownMenuItem
                    key={i}
                    className="px-2 hover:bg-primary"
                  >
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
