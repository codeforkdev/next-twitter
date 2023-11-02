import { and, eq } from "drizzle-orm";
import { ArrowLeft, Calendar } from "lucide-react";
import BackButton from "@/app/_components/BackButton";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import React from "react";
import Tabs from "./(tabs)/Tabs";
import { ScrollInView } from "@/app/_components/ScrollInView";
import { Controls } from "./_components/Controls";
import { Avatar } from "@/app/_components/Avatar";
import { Spacer } from "@/app/_components/Spacer";
import { followings, users } from "@/server/db/schema";
import db from "@/server/db";
import { verifyJWT } from "@/lib/auth";
import { MainLayout } from "@/app/_layouts/MainLayout";
import { Aside } from "../../home/layout";

export default async function Layout({
  params,
  children,
}: {
  params: { handle: string };
  children: React.ReactNode;
}) {
  const {
    payload: { user: me },
  } = await verifyJWT();

  const userProfile = await db.query.users.findFirst({
    where: eq(users.handle, params.handle),
    columns: {
      password: false,
    },
    with: {
      posts: true,
    },
  });

  if (!userProfile) {
    return <div>User does not exist</div>;
  }

  const { posts, ...profile } = userProfile;
  const followers = await db.query.followings.findMany({
    where: eq(followings.followingId, profile.id),
  });

  const following = await db.query.followings.findMany({
    where: eq(followings.followerId, profile.id),
  });

  const isFollowing = await db.query.followings.findFirst({
    where: and(
      eq(followings.followingId, profile.id),
      eq(followings.followerId, me.id),
    ),
  });
  return (
    <MainLayout
      main={
        <>
          <Header displayName={profile.displayName} numOfPosts={posts.length} />
          <div className="relative">
            <Banner src={faker.image.urlLoremFlickr({ category: "nature" })} />
            <Avatar
              src={userProfile.avatar ?? ""}
              className="absolute left-4 h-20 w-20 -translate-y-1/2 overflow-clip rounded-full border-[4px] border-black tablet:h-[140px] tablet:w-[140px]"
            />
          </div>
          <Controls
            handle={me.handle}
            followerId={me.id}
            followingId={userProfile.id}
            isFollowing={isFollowing ? true : false}
          />
          <Spacer className="my-1" />
          <Bio user={profile} />
          <Spacer className="my-3" />
          <div className="flex gap-4 px-5 text-sm">
            <div>
              {following.length}{" "}
              <span className="text-sm text-white/50">Following</span>
            </div>
            <div>
              {followers.length}{" "}
              <span className="text-white/50">Following</span>
            </div>
          </div>
          <Spacer className="my-8" />
          <Tabs handle={profile.handle} />
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

const Bio = ({ user }: { user: any }) => {
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
    <div className="relative h-[125px] tablet:h-[200px]">
      <Image src={src} alt="profile banner" fill objectFit="cover" />
    </div>
  );
};

const ProfileDetails = async ({ handle }: { handle: string }) => {
  return <></>;
};
