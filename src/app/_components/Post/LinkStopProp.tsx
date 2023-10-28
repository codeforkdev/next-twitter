import Link from "next/link";
import React from "react";

type Props = {
  className?: string;
  href: string;
  children: React.ReactNode[] | React.ReactNode;
};
export default function LinkNoPropagation(props: Props) {
  return (
    <Link
      href={props.href}
      className={props.className}
      onClick={(e) => e.stopPropagation()}
    >
      {props.children}
    </Link>
  );
}
