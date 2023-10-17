"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useVelocity,
} from "framer-motion";
import { Bell, Feather, Home, LucideIcon, Mail, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function ComposePostBtn({ dim }: { dim: boolean }) {
  const router = useRouter();
  const variant = {
    dim: {
      opacity: 0.4,
    },
    bright: {
      opacity: 1,
    },
  };
  return (
    <motion.button
      animate={dim ? "bright" : "dim"}
      variants={variant}
      className="h-14 w-14 bg-primary flex justify-center items-center  rounded-full fixed bottom-[74px] right-5 tablet:hidden"
      onClick={() => router.push("/compose/post")}
    >
      <Feather size={26} />
    </motion.button>
  );
}

export function MobileNavbar(props: {}) {
  const { scrollY } = useScroll();
  const [y, setY] = useState(scrollY.get());
  const [dim, setDim] = useState(y === 0 ? true : false);
  const scrollVelocity = useVelocity(scrollY);

  const handleScrollYChange = (latest: number) => {
    if (latest === 0) {
      setDim(true);
      return;
    }
    if (latest < y) {
      if (scrollVelocity.get() < -3200) {
        setDim(true);
      }
    } else {
      setDim(false);
    }
    setY(latest);
  };
  useMotionValueEvent(scrollY, "change", handleScrollYChange);

  return (
    <>
      <ComposePostBtn dim={dim} />
      <Wrapper dim={dim}>
        <ul className="flex justify-evenly gap-8 items-center h-full max-w-[352px] mx-auto">
          <Link href="/home">
            <Icon Icon={Home} href="/home" />
          </Link>
          <Link href="/explore">
            <Icon Icon={Search} href="/explore" />
          </Link>
          <Link href="/notifications">
            <Icon Icon={Bell} href="/notifications" />
          </Link>
          <Link href={"/messages"}>
            <Icon Icon={Mail} href="/messages" />
          </Link>
        </ul>
      </Wrapper>
    </>
  );
}

export function Wrapper({
  children,
  dim,
}: {
  children: React.ReactNode;
  dim: boolean;
}) {
  return (
    <motion.nav
      animate={dim ? "bright" : "dim"}
      variants={{
        dim: {
          opacity: 0.4,
        },
        bright: {
          opacity: 1,
        },
      }}
      className="h-[53px] border-t border-t-slate-700 tablet:hidden fixed bottom-0 left-0 w-full bg-black"
    >
      {children}
    </motion.nav>
  );
}

const Icon = ({ Icon, href }: { Icon: LucideIcon; href: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <div className="relative group tablet:hover:bg-white/10 active:bg-white/10 desktop:hover:bg-white/0 h-12 w-12 flex items-center justify-center rounded-full desktop:hover:bg-none">
      <Icon
        size={active ? 30 : 25}
        className={cn("-mt-0.5", {
          "fill-white stroke-black": active && href !== "/explore",
          "stroke-3": href === "/explore",
        })}
      />
    </div>
  );
};
