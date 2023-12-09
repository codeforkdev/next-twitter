"use client";
import { z } from "zod";
import { Input } from "../login/_components/CredentialAuth";
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spacer } from "@/app/_components/Spacer";
import React, { useState } from "react";
import Link from "next/link";
import Loading from "@/app/(main)/home/loading";
import { signUp } from "@/actions/auth";

type Result<T> = { success: true; data: T } | { success: false; error: string };
type AsyncFunction = (...args: any) => Promise<any>;

function useAction<T extends AsyncFunction>(action: T) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type ActionParams = Parameters<T>;
  type ActionReturnType = Awaited<Result<T>>;

  const run = async (params: ActionParams[0]): Promise<ActionReturnType> => {
    setIsLoading(true);
    const response = await action(params);
    response.success ? setError(null) : setError(response.error);
    setIsLoading(false);
    return response;
  };

  return { run, isLoading, error };
}

const schema = z
  .object({
    handle: z.string().trim().min(1, { message: "Required" }),
    email: z.string().email({ message: "Required" }),
    password: z.string().trim().min(1, { message: "Required" }),
    confirmPassword: z.string().trim().min(1, { message: "Required" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: "custom", message: "Password does not match" });
    }
  });

type Schema = z.infer<typeof schema>;

export default function Page() {
  const methods = useForm<Schema>({ resolver: zodResolver(schema) });

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex flex-col">
        <p className="text-center text-3xl font-semibold">
          Create your account
        </p>
        <form
          onSubmit={methods.handleSubmit(({ handle, email, password }) => {
            signUp({ handle, email, password });
          })}
          className="mx-auto w-full max-w-sm px-4"
        >
          <Spacer className="py-6" />
          <div className="flex flex-col gap-4">
            <TextInput fieldName="handle" placeholder="Handle" />
            <TextInput fieldName="email" placeholder="Email" />
            <TextInput
              type="password"
              fieldName="password"
              placeholder="Password"
            />
            <TextInput
              type="password"
              fieldName="confirmPassword"
              placeholder="Confirm Password"
            />

            <button
              disabled={methods.formState.isSubmitting}
              type="submit"
              className="relative flex w-full items-center justify-center gap-4 rounded-lg  bg-primary py-2  transition-all duration-500 active:translate-y-[1px] disabled:pointer-events-none disabled:animate-none disabled:bg-primary/50"
            >
              <span className="font-semibold">Sign up</span>
              <div className="relative">
                <span className="absolute -translate-y-1/2">
                  <Loading
                    size="h-5 w-5"
                    show={methods.formState.isSubmitting}
                  />
                </span>
              </div>
            </button>
            <div>
              <p>
                Already have an account?{" "}
                <span>
                  <Link href="/login" className="text-primary">
                    Sign in
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

function TextInput({
  fieldName,
  placeholder,
  type,
}: {
  fieldName: string;
  placeholder: string;
  type?: string;
}) {
  const methods = useFormContext();
  const value = useWatch({ name: fieldName });
  const controller = useController({
    name: fieldName,
    control: methods.control,
  });

  return (
    <Input
      type={type}
      name={fieldName}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        methods.setValue(fieldName, e.target.value);
      }}
      onBlur={controller.field.onBlur}
      error={controller.fieldState.error ? true : false}
    />
  );
}

// function StepsIndicator({ length, step }: { length: number; step: number }) {
//   return (
//     <div className="flex gap-4">
//       {new Array(length).fill(null).map((_, i) => {
//         const active = i + 1 === step;
//         return (
//           <div
//             className={cn("h-[5px] flex-1 rounded-full ", {
//               "animate-pulse bg-primary": active,
//               "bg-primary/60": !active,
//               "bg-primary": i + 1 < step,
//             })}
//           />
//         );
//       })}
//     </div>
//   );
// }

// const useSteps = (steps: number) => {
//   const [step, setStep] = useState(1);

//   const next = () => step < steps && setStep((prev) => prev + 1);
//   const back = () => step > 1 && setStep((prev) => prev - 1);
//   return { step, next, back, atStart: step === 1, atEnd: step === steps };
// };

// function NextButton({
//   disabled,
//   end,
//   onClick,
// }: {
//   disabled: boolean;
//   end: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       disabled={disabled}
//       className={cn(
//         "w-full rounded bg-primary py-2 duration-200 disabled:bg-primary/50",
//       )}
//       onClick={() => {
//         console.log("NEXT");
//         onClick();
//       }}
//     >
//       Next
//     </button>
//   );
// }
