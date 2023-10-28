import Image from "next/image";
import React from "react";
import Link from "next/link";
import { PostForm } from "./@components/PostForm";
import { ScrollInView } from "@/app/_components/ScrollInView";
import Tab from "./@components/Tab";
import MobileSideNavToggle from "@/app/_components/Navigation/MobileSideNavToggle";
import { verifyJWT } from "@/lib/auth";
import { UserSchemaNoPassword } from "@/app/db/stores/User";
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
            <MobileSideNavToggle />

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
