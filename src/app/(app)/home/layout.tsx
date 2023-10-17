import Image from "next/image";
import React from "react";
import Link from "next/link";
import Search from "../explore/@components/Search";
import { user } from "@/mock/mock-data";
import { PostForm } from "./@components/PostForm";
import { Avatar } from "@/components/Avatar";
import { ScrollInView } from "@/components/ScrollInView";
import Tab from "./@components/Tab";

export const MainLayout = ({
  main,
  aside,
}: {
  main: React.ReactNode;
  aside: React.ReactNode;
}) => {
  return (
    <div className="flex h-full w-full">
      <main className="w-full max-w-[600px] shrink-0 border-r border-white/20">
        {main}
      </main>
      <aside className="sticky top-0  hidden h-screen flex-1 flex-col gap-3 px-5 py-3 laptop:flex">
        {aside}
      </aside>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout
      main={
        <>
          <Header />
          <PostForm />
          <NewPostsIndicator />
          {children}
        </>
      }
      aside={<Aside />}
    />
  );
}

function NewPostsIndicator() {
  return (
    <div className="border-b border-white/20 py-[12px] text-center text-primary">
      Show 385 posts
    </div>
  );
}

function Header() {
  return (
    <>
      <ScrollInView
        top={-106}
        className="sticky z-10  flex w-full shrink-0 flex-col justify-between"
      >
        <header
          className="flex h-[106px] flex-col justify-between border-b border-white/20"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <section className="flex items-center pl-4 pt-[10px] text-xl">
            {/* Desktop title */}
            <h1 className="hidden text-xl font-semibold text-gray-100 tablet:block">
              Home
            </h1>

            {/* Profile Avatar */}
            <div className="flex-1  tablet:hidden">
              <Avatar src={user.avatar} />
            </div>

            {/* Logo */}
            <div className="-ml-4 tablet:hidden">
              <div className="relative h-[20px] w-[20px]">
                <Image src={"/logo.svg"} alt="logo" fill />
              </div>
            </div>

            {/* Buffer to center logo */}
            <div className="flex-1" />
          </section>

          {/* Tabs */}
          <section className="flex">
            <Tab href="/home">For you</Tab>
            <Tab href="/home/following">Following</Tab>
          </section>
        </header>
      </ScrollInView>
    </>
  );
}

export function Aside() {
  return (
    <>
      <div className="relative">
        {/* <Search onBlur={() => {}} onFocus={() => {}} onChange={() => {}} /> */}
      </div>
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
        <p className="mb-2 text-xl font-bold">What's happening</p>
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
