import { db } from "@/drizzle/db";
import { followings, users } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Calendar } from "lucide-react";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import React from "react";
import Tabs from "./(tabs)/Tabs";
import { ScrollInView } from "@/components/ScrollInView";
import { user as me, user } from "@/mock/mock-data";
import { Controls } from "./@components/Controls";
import { Aside, MainLayout } from "../../home/layout";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";

export default async function Layout({
  params,
  children,
}: {
  params: { handle: string };
  children: React.ReactNode;
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.handle, params.handle),
    with: {
      posts: true,
    },
  });

  if (!user) {
    return <div>User does not exist</div>;
  }
  const followers = await db.query.followings.findMany({
    where: eq(followings.followingId, user.id),
  });

  const following = await db.query.followings.findMany({
    where: eq(followings.followerId, user.id),
  });

  const isFollowing = await db.query.followings.findFirst({
    where: and(
      eq(followings.followingId, user.id),
      eq(followings.followerId, me.id),
    ),
  });
  return (
    <MainLayout
      main={
        <>
          <Header
            displayName={user.displayName}
            numOfPosts={user.posts.length}
          />
          <div className="relative">
            <Banner src={faker.image.urlLoremFlickr({ category: "nature" })} />
            <Avatar
              src={user.avatar ?? ""}
              className="absolute left-4 h-[140px] w-[140px] -translate-y-1/2 overflow-clip rounded-full border-[4px] border-black"
            />
          </div>
          <Controls
            handle={me.handle}
            followerId={me.id}
            followingId={user.id}
            isFollowing={isFollowing ? true : false}
          />
          <Spacer className="my-4" />
          <Bio user={user} />
          <Spacer className="my-8" />
          <div className="flex gap-4">
            <div>
              {following.length}{" "}
              <span className="white/50 text-sm">Following</span>
            </div>
            <div>{followers.length} Following</div>
          </div>

          <Tabs handle={user.handle} />
          {children}
        </>
      }
      aside={<Aside />}
    />
  );
}

const Header = ({
  displayName,
  numOfPosts,
}: {
  displayName: string;
  numOfPosts: number;
}) => {
  return (
    <ScrollInView top={-50} className="sticky z-50">
      <header
        className="flex items-center gap-10 bg-black/70 px-6 py-[5px]"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <BackButton>
          <ArrowLeft size={20} />
        </BackButton>
        <div className="flex flex-col">
          <h2 className="font-bold text-gray-300">{displayName}</h2>
          <p className="text-sm text-gray-400">{numOfPosts} posts</p>
        </div>

        {/* <button className="border-gray-500  h-8 border rounded-full px-4 tracking-wide ml-auto font-semibold">
            Follow
          </button> */}
      </header>
    </ScrollInView>
  );
};

const Bio = ({ user }: { user: typeof users.$inferSelect }) => {
  return (
    <div className="px-5 pt-0">
      <h1 className="text-xl font-bold tracking-wide text-gray-200">
        {user.displayName}
      </h1>
      <div className="flex items-center gap-2 text-gray-400">
        <span>@{user.handle}</span>
        <span className="bg-white/10 p-1 text-xs">Follows you</span>
      </div>
      <Spacer className="my-3" />
      <div>
        <p className="flex items-center text-sm text-white/50">
          <span>
            <Calendar size={18} />
          </span>
          Joined{" "}
          {new Date(user.createdAt).toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

const Banner = ({ src }: { src: string }) => {
  return (
    <div className="relative h-[200px]">
      <Image src={src} alt="profile banner" fill objectFit="cover" />
    </div>
  );
};

const ProfileDetails = async ({ handle }: { handle: string }) => {
  return <></>;
};
