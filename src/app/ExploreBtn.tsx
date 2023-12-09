"use client";

import { signUp } from "@/actions/auth";
import { nanoid } from "nanoid";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { Input } from "./(auth)/login/_components/CredentialAuth";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  handle: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(21, { message: "Max character limit 21 exceeded" }),
});

type Schema = z.infer<typeof schema>;

export function ExploreBtn() {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="block w-full rounded-full  bg-rose-600 py-2 text-center text-sm font-semibold text-white active:translate-y-[1px]">
          Explore
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-800/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black">
          <form
            onSubmit={handleSubmit(async ({ handle }) => {
              const demoUser = {
                handle,
                email: `demo.${handle}@codefork.com`,
                password: "fuckitshipit",
              };
              console.log("Create demo user: ", handle);
              const response = await signUp(demoUser);
              if (!response.ok) {
                setError("handle", {
                  message: response.message,
                });
              }
            })}
          >
            <div className="relative flex items-center justify-center p-4">
              <XIcon className="absolute left-4" />
              <h3 className=" text-center text-3xl font-semibold tracking-wider">
                Explore
              </h3>
            </div>
            <div className="px-4">
              <p className="text-sm text-neutral-300">
                Look around and explore. Your session will end in 30 minutes and
                all data associated will be deleted.
              </p>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <Controller
                name="handle"
                control={control}
                render={({ field: { onChange }, fieldState: { error } }) => (
                  <div className="flex flex-col gap-1">
                    <div className="text-right text-xs text-red-500">
                      {errors?.handle?.message}
                    </div>
                    <Input
                      onChange={onChange}
                      error={error ? true : false}
                      placeholder="handle"
                    />
                  </div>
                )}
              />
              <button className="w-full rounded bg-primary p-2">Login</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
