"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { BellPlusIcon, MailIcon, MoreHorizontal, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { followAction } from "@/actions/actions";
import { Avatar } from "@/app/_components/Avatar";
import { Input } from "@/app/(auth)/login/_components/CredentialAuth";

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

  const Trigger = () => {
    return (
      <button className="h-8  rounded-full border border-gray-500 px-4 tracking-wide">
        Edit profile
      </button>
    );
  };

  if (pathname.endsWith(handle)) {
    return (
      <Container>
        {/* <EditProfileButton onClick={handleEditProfileClick} /> */}
        <Modal
          trigger={<Trigger />}
          content={<EditProfileForm avatar={""} banner={""} name={""} />}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <MoreButton size={size} />
        <NotificationButton size={size} />
        <MessageButton size={size} />
        <FollowButton
          isFollowing={isFollowing}
          followerId={followerId}
          followingId={followingId}
        />
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

export function Button(props: ButtonProps) {
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

export function FollowButton(props: {
  isFollowing: boolean;
  followerId: string;
  followingId: string;
}) {
  const { isFollowing, followerId, followingId } = props;
  return (
    <button
      className={cn(
        "group  h-8 rounded-full border border-gray-500 px-4 tracking-wide",
        {
          "hover:border-red-900/50 hover:bg-red-500/20 hover:text-red-500":
            isFollowing,
          "hover:border-primary hover:bg-primary/20 hover:text-primary":
            !isFollowing,
        },
      )}
      onClick={() => {
        followAction(isFollowing, followerId, followingId);
      }}
      {...props}
    >
      {props.isFollowing ? (
        <>
          <span className="block group-hover:hidden">following</span>
          <span className="hidden group-hover:block">unfollow</span>
        </>
      ) : (
        "follow"
      )}
    </button>
  );
}

export const MessageButton = ({ size }: { size: number }) => {
  const handleClick = () => {};
  return (
    <Button onClick={handleClick}>
      <MailIcon size={size} />
    </Button>
  );
};

export const MoreButton = ({ size }: { size: number }) => {
  const handleClick = (e: ClickEvent) => {};
  return (
    <Button onClick={handleClick}>
      <MoreHorizontal size={size} />
    </Button>
  );
};

export const NotificationButton = ({ size }: { size: number }) => {
  const handleClick = (e: ClickEvent) => {};
  return (
    <Button onClick={handleClick}>
      <BellPlusIcon size={size} />
    </Button>
  );
};

export function EditProfileForm(props: {
  avatar: string;
  banner: string;
  name: string;
}) {
  const { avatar, banner, name } = props;
  return (
    <form>
      <div className="flex items-center gap-8 p-2">
        <Dialog.Close>
          <XIcon size={20} />
        </Dialog.Close>
        <p className="text-lg font-semibold">Edit Profile</p>
        <button
          type="submit"
          onClick={() => console.log("save")}
          className="ml-auto rounded-full bg-neutral-100 px-4 py-1 text-sm font-semibold text-black"
        >
          Save
        </button>
      </div>

      <div className="relative h-48 w-full">
        <Image src={banner} alt="" fill />
      </div>
      <Avatar
        src={avatar}
        className="absolute h-28 w-28 -translate-y-1/2 translate-x-1/4 border-4 border-black"
      />
      <div className="py-8" />
      <div className="flex flex-col gap-4 p-4">
        <Input
          error={false}
          placeholder="Name"
          containerStyles="rounded"
          value={name}
        />
        <Input error={false} placeholder="Bio" containerStyles="rounded" />
        <Input error={false} placeholder="Location" containerStyles="rounded" />
        <Input error={false} placeholder="Website" containerStyles="rounded" />
      </div>
    </form>
  );
}

export function Modal(props: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  const { trigger, content } = props;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-500/50" />
        <Dialog.Content className="fixed left-1/2 top-96 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black">
          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
