"use client";

import { BellIcon, BellPlusIcon, MailIcon, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { followAction } from "@/actions/actions";
import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { user } from "@/mock/mock-data";

type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export const Controls = ({
  handle,
  isFollowing,
  followerId,
  followingId,
}: {
  handle: string;
  isFollowing: boolean;
  followerId: string;
  followingId: string;
}) => {
  const pathname = usePathname();
  const size = 18;

  const handleFollowClick = () => {
    console.log("clicked follow button");
    followAction(isFollowing, followerId, followingId);
  };

  const handleEditProfileClick = (e: ClickEvent) => {};

  if (pathname.endsWith(handle)) {
    return (
      <Container>
        <EditProfileButton onClick={handleEditProfileClick} />
      </Container>
    );
  } else {
    return (
      <Container>
        <MoreButton size={size} />
        <NotificationButton size={size} />
        <MessageButton size={size} />
        <FollowButton isFollowing={isFollowing} onClick={handleFollowClick} />
      </Container>
    );
  }
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end text-gray-200 py-4 pr-4 gap-2">
      {children}
    </div>
  );
};

function Button(props: ButtonProps) {
  return (
    <button
      className={cn(
        "border-gray-500 h-8 w-8 rounded-full border flex items-center justify-center",
        props.className
      )}
      {...props}
    >
      {props.children}
    </button>
  );
}

function FollowButton(props: ButtonProps & { isFollowing: boolean }) {
  return (
    <button
      className="border-gray-500  h-8 border rounded-full px-4 tracking-wide"
      {...props}
    >
      {props.isFollowing ? "following" : "follow"}
    </button>
  );
}

const MessageButton = ({ size }: { size: number }) => {
  const handleClick = () => {
    console.log("clicked message button");
  };
  return (
    <Button onClick={handleClick}>
      <MailIcon size={size} />
    </Button>
  );
};

const MoreButton = ({ size }: { size: number }) => {
  const handleClick = (e: ClickEvent) => {
    console.log("clicked more button");
  };
  return (
    <Button onClick={handleClick}>
      <MoreHorizontal size={size} />
    </Button>
  );
};

const NotificationButton = ({ size }: { size: number }) => {
  const handleClick = (e: ClickEvent) => {
    console.log("clicked notification button");
  };
  return (
    <Button onClick={handleClick}>
      <BellPlusIcon size={size} />
    </Button>
  );
};

function EditProfileButton(props: ButtonProps) {
  return (
    <button className="border-gray-500  h-8 border rounded-full px-4 tracking-wide">
      Edit profile
    </button>
  );
}
