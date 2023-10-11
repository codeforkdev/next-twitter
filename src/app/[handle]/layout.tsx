import { db } from "@/drizzle/db";
import { followings, users } from "@/drizzle/schema";
import { and, eq, or } from "drizzle-orm";
import {
  ArrowLeft,
  BellPlusIcon,
  MailIcon,
  MoreHorizontal,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import { cn } from "@/lib/utils";
import React from "react";
import Tabs from "./(tabs)/Tabs";
import { ScrollInView } from "@/components/ScrollInView";
import FollowBtn from "./@components/FollowButton";
import { user as me, user } from "@/mock/mock-data";
import { usePathname } from "next/navigation";
import { Controls } from "./@components/Controls";
import { Aside, MainLayout } from "../home/layout";

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

  const isFollowing = await db.query.followings.findFirst({
    where: and(
      eq(followings.followingId, user.id),
      eq(followings.followerId, me.id)
    ),
  });
  console.log(isFollowing);
  return (
    <>
      <MainLayout
        main={
          <>
            <Header
              displayName={user.displayName}
              numOfPosts={user.posts.length}
            />
            <div className="relative">
              <Banner
                src={faker.image.urlLoremFlickr({ category: "nature" })}
              />
              <Avatar
                src={user.avatar ?? ""}
                className="absolute -translate-y-1/2 left-4"
              />
            </div>
            <Controls
              handle={me.handle}
              followerId={me.id}
              followingId={user.id}
              isFollowing={isFollowing ? true : false}
            />
            <Bio user={user} />
            <Tabs handle={user.handle} />
            {children}
          </>
        }
        aside={<Aside />}
      />
    </>
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
    <ScrollInView top={-50} className="z-50 sticky">
      <header
        className="flex items-center py-[5px] px-6 gap-10 bg-black/70"
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
    <div className="p-5 pt-0">
      <h1 className="font-bold text-2xl text-gray-200 tracking-wide">
        {user.displayName}
      </h1>
      <div className="text-gray-400 flex gap-2 items-center">
        <span>@{user.handle}</span>
        <span className="bg-white/10 p-1 text-xs">Follows you</span>
      </div>
    </div>
  );
};

export const Avatar = ({
  src,
  className,
}: {
  src: string;
  className: string;
}) => {
  return (
    <div
      className={cn(
        "h-[88px] w-[88px] rounded-full overflow-clip relative border-[3px] border-black",
        className
      )}
    >
      <Image src={src} alt="avatar" fill />
    </div>
  );
};

const Banner = ({ src }: { src: string }) => {
  return (
    <div className="h-[140px] relative">
      <Image src={src} alt="profile banner" fill objectFit="cover" />
    </div>
  );
};
