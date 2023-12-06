"use client";

import { z } from "zod";
import { Input } from "../login/_components/CredentialAuth";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@/app/_components/Avatar";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import { Spacer } from "@/app/_components/Spacer";
import { cn } from "@/lib/utils";
import React, { createContext, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

const schema = z.object({
  displayname: z.string().trim().min(1, { message: "required" }),
  handle: z.string().trim().min(1, { message: "Required" }),
});

function StepsIndicator({ length, step }: { length: number; step: number }) {
  return (
    <div className="flex gap-4">
      {new Array(length).fill(null).map((_, i) => {
        const active = i + 1 === step;
        return (
          <div
            className={cn("h-[5px] flex-1 rounded-full ", {
              "animate-pulse bg-primary": active,
              "bg-primary/60": !active,
              "bg-primary": i + 1 < step,
            })}
          />
        );
      })}
    </div>
  );
}

type Schema = z.infer<typeof schema>;

const StepContext = createContext({
  currentStep: 1,
  next: () => {},
  back: () => {},
});

const useSteps = (steps: number) => {
  const [step, setStep] = useState(1);

  const next = () => step < steps && setStep((prev) => prev + 1);
  const back = () => step > 1 && setStep((prev) => prev - 1);
  return { step, next, back, atStart: step === 1, atEnd: step === steps };
};

export default function Page() {
  const { step, back, next, atEnd, atStart } = useSteps(3);

  const methods = useForm<Schema>({ resolver: zodResolver(schema) });

  const steps = [Step, Step, Step];
  return (
    <FormProvider {...methods}>
      <Spacer className="py-2" />
      <button
        onClick={back}
        className="fixed left-10 top-10 rounded-full p-2 transition-colors hover:bg-white/10 laptop:absolute laptop:left-4 laptop:top-2 "
      >
        <ArrowLeftIcon />
      </button>
      <div className="flex h-full flex-col">
        <div className="relative flex flex-1 overflow-x-clip">
          {steps.map((Step, i) => (
            <Step key={i + 1} currStep={step} step={i + 1} />
          ))}
        </div>
        <div className=" flex flex-col gap-8 px-12 pb-20">
          {!atEnd ? (
            <NextButton disabled={false} end={false} onClick={next} />
          ) : (
            <button
              disabled={true}
              className={cn(
                "w-full rounded bg-primary py-2 duration-200 disabled:bg-primary/50",
              )}
            >
              Submit
            </button>
          )}

          <StepsIndicator length={steps.length} step={step} />
        </div>

        {/* <Spacer className="py-1" /> */}
        {/* <div className="relative h-52">
        <Image
          src={faker.image.urlLoremFlickr({ category: "nature" })}
          className="w-full"
          alt=""
          fill
        />
      </div>
      <Avatar
        src={faker.image.avatar()}
        className=" h-32 w-32 -translate-y-3/4 translate-x-1/4 border-4 border-black"
      />
      <Spacer className="-my-8" /> */}
      </div>
    </FormProvider>
  );
}

function NextButton({
  disabled,
  end,
  onClick,
}: {
  disabled: boolean;
  end: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "w-full rounded bg-primary py-2 duration-200 disabled:bg-primary/50",
      )}
      onClick={() => {
        console.log("NEXT");
        onClick();
      }}
    >
      Next
    </button>
  );
}

function Step({ step, currStep }: { step: number; currStep: number }) {
  const {
    control,
    formState: { errors, isValid },
  } = useFormContext();
  const done = step < currStep;
  const viewing = step === currStep;
  return (
    <div
      className={cn(
        "absolute h-full w-full shrink-0 transition-all duration-500",
        {
          "-translate-x-full opacity-0": done,
          "translate-x-full": !done,
          "translate-x-0": viewing,
        },
      )}
    >
      <p className="text-center text-3xl font-semibold">Create your identity</p>
      <Spacer className="py-6" />
      <div className="flex flex-col gap-4 px-6">
        <Controller
          control={control}
          name="handle"
          render={({
            field: { name, onChange, value },
            fieldState: { error },
          }) => (
            <Input
              autoFocus={true}
              name={name}
              placeholder="Handle"
              value={value}
              onChange={onChange}
              error={error ? true : false}
            />
          )}
        />
        <Controller
          control={control}
          name="displayname"
          render={({
            field: { name, onChange, value },
            fieldState: { error },
          }) => (
            <Input
              name={name}
              placeholder="Display Name"
              value={value}
              onChange={onChange}
              error={error ? true : false}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({
            field: { name, onChange, value },
            fieldState: { error },
          }) => (
            <Input
              name={name}
              placeholder="Email"
              value={value}
              onChange={onChange}
              error={error ? true : false}
            />
          )}
        />
      </div>
    </div>
  );
}
