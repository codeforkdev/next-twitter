"use client";
import Link from "next/link";
import { Spacer } from "@/app/_components/Spacer";
import { CredentialAuthForm } from "./_components/CredentialAuth";

export default function Page() {
  return (
    <div className=" mx-auto max-w-[19rem]">
      <p className="text-center text-3xl font-semibold">Sign in</p>
      <Spacer className="my-8" />

      <div className="my-4 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-gray-300/50" />
        <div>or</div>
        <div className="h-[1px] flex-1 bg-gray-300/50" />
      </div>
      <CredentialAuthForm />
      <Spacer className="my-6" />
      <Link
        href="/forget"
        className="block w-full rounded-full border border-gray-600 bg-transparent py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-300/10"
      >
        Forgot password ?
      </Link>

      <Spacer className="py-2" />
      <p>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
