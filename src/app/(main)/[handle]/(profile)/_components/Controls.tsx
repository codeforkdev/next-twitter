"use client";

import { BellPlusIcon, MailIcon, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { followAction } from "@/actions/actions";

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
    <div className="flex justify-end gap-2 py-4 pr-4 text-gray-200">
      {children}
    </div>
  );
};

function Button(props: ButtonProps) {
  return (
    <button
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border border-gray-500",
        props.className,
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
      className="h-8  rounded-full border border-gray-500 px-4 tracking-wide"
      {...props}
    >
      {props.isFollowing ? "following" : "follow"}
    </button>
  );
}

const MessageButton = ({ size }: { size: number }) => {
  const handleClick = () => {};
  return (
    <Button onClick={handleClick}>
      <MailIcon size={size} />
    </Button>
  );
};

const MoreButton = ({ size }: { size: number }) => {
  const handleClick = (e: ClickEvent) => {};
  return (
    <Button onClick={handleClick}>
      <MoreHorizontal size={size} />
    </Button>
  );
};

const NotificationButton = ({ size }: { size: number }) => {
  const handleClick = (e: ClickEvent) => {};
  return (
    <Button onClick={handleClick}>
      <BellPlusIcon size={size} />
    </Button>
  );
};

function EditProfileButton(props: ButtonProps) {
  return (
    <button className="h-8  rounded-full border border-gray-500 px-4 tracking-wide">
      Edit profile
    </button>
  );
}