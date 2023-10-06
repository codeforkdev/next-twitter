import React from "react";
import Link from "next/link";
import SlideDownHeader from "./@components/SlideDownHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex gap-6">
      <div className="h-full flex flex-col border-r border-white/20 flex-2 max-w-[600px]">
        <SlideDownHeader />
        {children}
      </div>
      <aside className="hidden h-screen sticky top-0 laptop:flex flex-col gap-4 laptop:max-w-[350px]  flex-1 p-4 pl-0 ">
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
      </aside>
    </div>
  );
}
