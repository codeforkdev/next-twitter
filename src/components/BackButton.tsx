"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
      }}
    >
      {children}
    </button>
  );
}
