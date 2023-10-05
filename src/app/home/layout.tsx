import { Feather } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "./@components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full flex">
      <div className="flex-1 flex flex-col border-r border-r-white/20 ">
        <Header />
        <div>{children}</div>
      </div>

      {/* <aside className="h-full hidden desktop:w-[405px] desktop:block">
        hello
      </aside> */}
    </div>
  );
}
