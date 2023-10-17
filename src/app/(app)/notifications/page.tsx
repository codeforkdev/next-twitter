"use client";
import { Link } from "lucide-react";
import Search from "../explore/@components/Search";
import { MainLayout } from "../home/layout";

function Aside() {
  return (
    <>
      <div className="relative">
        <Search onBlur={() => {}} onFocus={() => {}} onChange={() => {}} />
      </div>
      <div className="w-full bg-[#16181c] p-4 rounded-xl">
        <p className="text-xl font-bold mb-2">Subscribe to Premium</p>
        <p className="mb-3 font-semibold text-sm">
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <button className="bg-primary font-semibold py-1 px-4 rounded-full">
          Subscribe
        </button>
      </div>

      <div className="w-full bg-[#16181c] p-4 rounded-xl">
        <p className="text-xl font-bold mb-2">What's happening</p>
        <p className="mb-3 font-semibold text-sm">
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

export default function Page() {
  return (
    <MainLayout
      main={<></>}
      aside={
        <>
          <Aside />
        </>
      }
    />
  );
}
