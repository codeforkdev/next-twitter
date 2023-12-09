import Link from "next/link";
import { Spacer } from "@/app/_components/Spacer";
import { CredentialAuthForm } from "./_components/CredentialAuth";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-3xl font-semibold">Sign in</p>
      <div className="mx-auto w-full max-w-sm">
        <CredentialAuthForm />
        <Spacer className="py-6" />
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
    </div>
  );
}
