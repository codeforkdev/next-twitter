import { getUser, logout } from "@/actions/auth";
import BackButton from "@/app/_components/BackButton";
import { Spacer } from "@/app/_components/Spacer";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/");
  return (
    <div className="flex h-full w-full items-center justify-center  bg-gray-600/50">
      <form action={logout} className="w-full max-w-xs rounded-xl bg-black p-8">
        <div className="relative mx-auto flex h-8 w-8 justify-center">
          <Image src="/logo.svg" alt="" fill />
        </div>

        <Spacer className="my-4" />
        <p className="text-lg font-semibold">Log out of X?</p>
        <Spacer className="my-2" />
        <p className="text-sm text-white/40">
          You can always log back in at any time. If you just want to switch
          accounts, you can do that by adding an existing account.{" "}
        </p>
        <Spacer className="my-5" />
        <button
          type="submit"
          className="w-full rounded-full border bg-white py-2 font-semibold text-black transition-colors hover:bg-white/90"
        >
          Log out
        </button>
        <Spacer className="my-3" />
        <BackButton className="w-full rounded-full border border-gray-500 py-2 font-semibold transition-colors hover:bg-gray-500/20">
          Cancel
        </BackButton>
      </form>
    </div>
  );
}
