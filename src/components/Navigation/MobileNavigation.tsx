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
      className="fixed bottom-[74px] right-5 flex h-14 w-14  items-center justify-center rounded-full bg-primary tablet:hidden"
      onClick={() => router.push("/compose/post")}
    >
      <Feather size={26} />
    </motion.button>
  );
}

export function MobileNavbar() {
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
        <ul className="mx-auto flex h-full max-w-[352px] items-center justify-evenly gap-8">
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
      className="fixed bottom-0 left-0 h-[53px] w-full border-t border-t-slate-700 bg-black tablet:hidden"
    >
      {children}
    </motion.nav>
  );
}

const Icon = ({ Icon, href }: { Icon: LucideIcon; href: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <div className="group relative flex h-12 w-12 items-center justify-center rounded-full active:bg-white/10 tablet:hover:bg-white/10 desktop:hover:bg-white/0 desktop:hover:bg-none">
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
