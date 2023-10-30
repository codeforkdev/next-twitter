"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  className?: string;
  href: string;
  children: React.ReactNode[] | React.ReactNode;
};
export default function LinkNoPropagation(props: Props) {
  const router = useRouter();
  return (
    <span
      className={props.className}
      onClick={(e) => {
        e.stopPropagation();
        router.push(props.href);
      }}
    >
      {props.children}
    </span>
  );
}
