"use client";
import { useRouter } from "next/navigation";
import React from "react";
type Props = {
  handle: string;
  id: string;
  children: React.ReactNode;
};
export default function PostLink(props: Props) {
  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        router.push(`/${props.handle}/${props.id}`);
      }}
    >
      {props.children}
    </div>
  );
}
