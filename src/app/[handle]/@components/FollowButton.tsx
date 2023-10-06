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
      className="border-gray-500  h-8 border rounded-full px-4 tracking-wide"
    >
      {isFollowing ? "following" : "follow"}
    </button>
  );
}
