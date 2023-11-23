import Image from "next/image";
import React from "react";
import Link from "next/link";
import { ScrollInView } from "@/app/_components/ScrollInView";
import Tab from "./_components/Tab";
import MobileSideNavToggle from "@/app/_components/Navigation/MobileSideNavToggle";
import { MainLayout } from "@/app/_layouts/MainLayout";
import SearchUsers from "./SearchUsers";
import { Spacer } from "@/app/_components/Spacer";
import { SettingsIcon } from "lucide-react";
import Post from "./_components/PostForm";

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
          <Spacer className={"py-2"} />
          <Post />
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
          className="flex flex-col justify-between border-b border-white/20"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <section className="flex items-center pl-4 pt-3 text-xl tablet:pt-0">
            {/* Desktop title */}
            <h1 className="mobile:block hidden text-xl font-semibold text-gray-100 desktop:hidden">
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
          <section className="flex h-[3.3rem] items-center">
            <Tab href="/home">For you</Tab>
            <Tab href="/home/following">Following</Tab>
            <div className="px-4">
              <button className=" rounded-full p-2 transition-colors hover:bg-white/10">
                <SettingsIcon size={20} />
              </button>
            </div>
          </section>
        </header>
      </ScrollInView>
    </>
  );
}

export function Aside() {
  return (
    <>
      <Spacer className="pt-1" />

      <div className="flex flex-col gap-4">
        <SearchUsers />
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
      </div>
    </>
  );
}
