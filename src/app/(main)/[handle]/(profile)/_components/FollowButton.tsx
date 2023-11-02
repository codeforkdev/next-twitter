"use client";

import { followAction } from "@/actions/actions";

export default function FollowBtn({
  isFollowing,
  followerId,
  followingId,
}: {
  isFollowing: boolean;
  followerId: string;
  followingId: string;
}) {
  const handleClick = () => {
    followAction(isFollowing, followerId, followingId);
  };
  return (
    <button
      onClick={handleClick}
      className="h-8  rounded-full border border-gray-500 px-4 tracking-wide"
    >
      {isFollowing ? "following" : "follow"}
    </button>
  );
}
