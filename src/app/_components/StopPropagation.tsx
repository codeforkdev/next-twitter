"use client";
import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};
export default function StopPropagation(props: Props) {
  return (
    <div onClick={(e) => e.stopPropagation()} className={props.className}>
      {props.children}
    </div>
  );
}
