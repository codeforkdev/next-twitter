"use client";

import { BellPlusIcon, MailIcon, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { followAction } from "@/actions/actions";

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
  const handleClick = () => {
    followAction(isFollowing, followerId, followingId);
  };
  const size = 18;

  return (
    <div className="flex justify-end text-gray-200 py-4 pr-4 gap-2">
      {pathname.endsWith(handle) ? (
        <button className="border-gray-500  h-8 border rounded-full px-4 tracking-wide">
          Edit profile
        </button>
      ) : (
        <>
          <button className=" border-gray-500 h-8 w-8 rounded-full border flex items-center justify-center">
            <MoreHorizontal size={size} />
          </button>

          <button className="border-gray-500 h-8 w-8 rounded-full border flex items-center justify-center">
            <MailIcon size={size} />
          </button>

          <button className="border-gray-500 h-8 w-8 rounded-full border flex items-center justify-center">
            <BellPlusIcon size={size} />
          </button>
          <button
            onClick={handleClick}
            className="border-gray-500  h-8 border rounded-full px-4 tracking-wide"
          >
            {isFollowing ? "following" : "follow"}
          </button>
        </>
      )}
    </div>
  );
};
