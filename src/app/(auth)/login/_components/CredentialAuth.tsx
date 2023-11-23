"use client";
import React, { forwardRef } from "react";
import { Spacer } from "@/app/_components/Spacer";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import * as RToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { login } from "../_actions";
import { useRouter } from "next/navigation";

type Result<T> = { success: true; data: T } | { success: false; error: string };
type AsyncFunction = (...args: any) => Promise<any>;

function useAction<T extends AsyncFunction>(action: T) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type ActionParams = Parameters<T>;
  type ActionReturnType = Awaited<Result<T>>;

  const execute = async (
    params: ActionParams[0],
  ): Promise<ActionReturnType> => {
    setIsLoading(true);
    const response = await action(params);
    response.success ? setError(null) : setError(response.error);
    setIsLoading(false);
    return response;
  };

  return { execute, isLoading, error };
}

export default function CredentialAuth() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<React.ReactNode | null>();
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const { execute, isLoading, error } = useAction(login);

  const handleLogin = async () => {
    const response = await execute({ name, password });
    if (response.success) {
      response.data;
      router.push("/home");
      return;
    }
    let newToast: React.ReactNode;
    switch (response.error) {
      case "Invalid credentials":
        newToast = <Toast className="bg-red-500">Invalid credentials</Toast>;
        break;
      case "User does not exist":
        newToast = (
          <Toast className="bg-primary">
            Sorry, we could not find your account.
          </Toast>
        );
        break;
    }
    setToast(newToast);
    setShowToast(true);
  };

  return (
    <>
      <Input
        error={error ? true : false}
        onInput={(e) => setName(e.currentTarget.value)}
        placeholder="Email or Handle"
      />
      <Spacer className="py-2" />
      <Input
        error={error ? true : false}
        onInput={(e) => setPassword(e.currentTarget.value)}
        placeholder="Password"
      />
      <Spacer className="my-6" />
      <button
        onClick={handleLogin}
        className="relative w-full rounded-full bg-gray-200 py-2 text-black transition-colors hover:bg-gray-200/90"
      >
        <span className="font-semibold">Login</span>

        <span className="absolute top-1/2 ml-2 -translate-y-1/2">
          <Loading loading={isLoading} />
        </span>
      </button>
      <RToast.Root onOpenChange={setShowToast} open={showToast}>
        {toast}
      </RToast.Root>
    </>
  );
}

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  error: boolean;
  inputStyles?: string;
  containerStyles?: string;
  placeholderStyles?: string;
}

export function Input(props: InputProps) {
  const [focused, setFocused] = useState<"focused" | "unfocused">("unfocused");
  return (
    <motion.div
      animate={focused}
      initial={{
        borderColor: "#404040",
      }}
      variants={{
        focused: {
          borderColor: props.error ? "red" : "#1d9bf0",
        },
        unfocused: {
          borderColor: props.error ? "red" : "#404040",
        },
      }}
      className={cn("relative w-full border", props.containerStyles)}
    >
      <motion.input
        onFocus={(e) => {
          setFocused("focused");
          props.onFocus && props.onFocus(e);
        }}
        onInput={(e) => {
          props.onInput && props.onInput(e);
        }}
        onChange={(e) => {
          props.onChange && props.onChange(e);
        }}
        onBlur={(e) => {
          if (e.currentTarget.value.trim()) {
          } else {
            setFocused("unfocused");
          }
        }}
        type="text"
        name="name"
        className={cn(
          "w-full bg-transparent p-2 pt-5 outline-none",
          props.inputStyles,
        )}
      />
      <motion.p
        initial={{
          position: "absolute",
          top: "50%",
          left: 10,
          translateY: "-50%",
        }}
        variants={{
          focused: {
            top: 12,
            left: 10,
            fontSize: "12px",
            color: props.error ? "red" : "#1d9bf0",
          },
          unFocused: {
            top: "50%",
            translateY: "-50%",
            // color: error ? "red" : "#64686d",
          },
        }}
        transition={{
          duration: 0.1,
        }}
        className={cn("pointer-events-none", props.placeholderStyles)}
      >
        {props.placeholder}
      </motion.p>
    </motion.div>
  );
}

function Loading({
  className,
  loading,
}: {
  className?: string;
  loading: boolean;
}) {
  return (
    <span
      className={cn(
        "hidden h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-primary",
        { block: loading },
        className,
      )}
    />
  );
}

const Toast = ({
  children,
  className,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{
        translateY: 100,
      }}
      animate={{ translateY: 0 }}
      className={cn("rounded  px-4 py-2 shadow-lg", className)}
    >
      <RToast.Title className="text-white">{children}</RToast.Title>
    </motion.div>
  );
};
