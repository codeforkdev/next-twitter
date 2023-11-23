import Link from "next/link";
import { Header } from "./_components/Header";
import { MainLayout } from "@/app/_layouts/MainLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      main={
        <>
          <Header />
          {children}
        </>
      }
      aside={<Aside />}
    />
  );
}

function Aside() {
  return (
    <>
      {/* <div className="relative">
        <Search onBlur={() => {}} onFocus={() => {}} onChange={() => {}} />
      </div> */}
      <div className="w-full rounded-xl bg-[#16181c] p-4">
        <p className="mb-2 text-xl font-bold">Subscribe to Premium</p>
        <p className="mb-3 text-sm font-semibold">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button className="rounded-full bg-primary px-4 py-1 font-semibold">
          Subscribe
        </button>
      </div>

      <div className="w-full rounded-xl bg-[#16181c] p-4">
        <p className="mb-2 text-xl font-bold">What&apos;s happening</p>
        <p className="mb-3 text-sm font-semibold">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <Link href="/explore" className="text-primary">
          show more
        </Link>
      </div>
    </>
  );
}
