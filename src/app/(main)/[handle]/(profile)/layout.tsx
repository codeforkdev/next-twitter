import { and, eq, sql } from "drizzle-orm";
import { ArrowLeft, Calendar } from "lucide-react";
import BackButton from "@/app/_components/BackButton";
import Image from "next/image";
import { faker } from "@faker-js/faker";
import React, { Suspense } from "react";
import Tabs from "./(tabs)/Tabs";
import { ScrollInView } from "@/app/_components/ScrollInView";
import {
  EditProfileForm,
  FollowButton,
  MessageButton,
  Modal,
  MoreButton,
  NotificationButton,
} from "./_components/Controls";
import { Avatar } from "@/app/_components/Avatar";
import { Spacer } from "@/app/_components/Spacer";
import { followings, users } from "@/server/db/schema";
import db from "@/server/db";
import { MainLayout } from "@/app/_layouts/MainLayout";
import { Aside } from "../../home/layout";
import { z } from "zod";
import { getUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  params,
  children,
}: {
  params: { handle: string };
  children: React.ReactNode;
}) {
  const me = await getUser();
  if (!me) redirect("/login");

  const profile = await db.query.users.findFirst({
    where: eq(users.handle, params.handle),
    columns: {
      password: false,
    },
  });

  if (!profile) {
    return <div>User does not exist</div>;
  }

  const banner = faker.image.urlLoremFlickr({ category: "nature" });

  function EditProfileBtn() {
    return (
      <Modal
        trigger={
          <button className="h-8  rounded-full border border-gray-500 px-4 tracking-wide">
            Edit profile
          </button>
        }
        content={
          <EditProfileForm
            avatar={me.avatar}
            banner={banner}
            name={me.displayName}
          />
        }
      />
    );
  }

  async function VisitorControls({ followingId }: { followingId: string }) {
    const isFollowing = await db.query.followings.findFirst({
      where: and(
        eq(followings.followingId, followingId),
        eq(followings.followerId, me.id),
      ),
    });
    return (
      <>
        <MoreButton size={18} />
        <NotificationButton size={18} />
        <MessageButton size={18} />
        <FollowButton
          isFollowing={isFollowing ? true : false}
          followerId={me.id}
          followingId={followingId}
        />
      </>
    );
  }

  function Controls({ followingId }: { followingId: string }) {
    return (
      <div className="flex justify-end gap-2 py-4 pr-4 text-gray-200">
        {params.handle === me.handle ? (
          <EditProfileBtn />
        ) : (
          <VisitorControls followingId={followingId} />
        )}
      </div>
    );
  }

  return (
    <MainLayout
      main={
        <>
          <ScrollInView top={-50} className="sticky z-50">
            <Header displayName={profile.displayName} userId={profile.id} />
          </ScrollInView>
          <Images banner={banner} avatar={profile.avatar} />
          <Controls followingId={profile.id} />
          <Spacer className="my-1" />
          <Bio user={profile} />
          <Spacer className="my-3" />
          <div className="flex gap-4 px-5 text-sm">
            <Following profileId={profile.id} />
            <Followers profileId={profile.id} />
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

async function PostsCount({ userId }: { userId: string }) {
  const schema = z.object({
    posts: z.coerce.number(),
  });
  const response = await db.execute(
    sql`SELECT COUNT(*) as posts FROM posts WHERE user_id = ${userId}`,
  );
  const { posts } = schema.parse(response.rows[0]);
  return <span>{posts}</span>;
}

async function Header(props: { displayName: string; userId: string }) {
  const { displayName, userId } = props;
  return (
    <header
      className="flex items-center gap-10 bg-black/70 px-6 py-[5px]"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <BackButton>
        <ArrowLeft size={20} />
      </BackButton>
      <div className="flex flex-col">
        <h2 className="font-bold text-gray-300">{displayName}</h2>
        <div className="flex gap-1.5 text-sm text-gray-400">
          <Suspense fallback={<span className="opacity-0">199</span>}>
            <PostsCount userId={userId} />
          </Suspense>
          <span>posts</span>
        </div>
      </div>
    </header>
  );
}

function Images({ banner, avatar }: { banner: string; avatar: string }) {
  const Banner = ({ src }: { src: string }) => {
    return (
      <div className="relative h-[125px] tablet:h-[200px]">
        <Image src={src} alt="profile banner" fill objectFit="cover" />
      </div>
    );
  };
  return (
    <section className="relative">
      <Banner src={banner} />
      <Avatar
        src={avatar}
        className="absolute left-4 h-20 w-20 -translate-y-1/2 overflow-clip rounded-full border-[4px] border-black tablet:h-[140px] tablet:w-[140px]"
      />
    </section>
  );
}

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

async function Following({ profileId }: { profileId: string }) {
  const following = await db.query.followings.findMany({
    where: eq(followings.followerId, profileId),
  });
  return (
    <div>
      {following.length}
      <span className="text-sm text-white/50">Following</span>
    </div>
  );
}

async function Followers({ profileId }: { profileId: string }) {
  const followers = await db.query.followings.findMany({
    where: eq(followings.followingId, profileId),
  });
  return (
    <div>
      {followers.length}
      <span className="text-white/50">Following</span>
    </div>
  );
}
