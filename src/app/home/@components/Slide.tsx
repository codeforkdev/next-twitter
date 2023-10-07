"use client";
import { useMotionValueEvent, useScroll, useVelocity } from "framer-motion";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function Slide({
  children,
  height,
  className,
}: {
  children: React.ReactNode;
  height: number;
  className: string;
}) {
  const { scrollY } = useScroll();
  const [y, setY] = useState(scrollY.get());
  const [show, setShow] = useState(y === 0 ? true : false);
  const scrollVelocity = useVelocity(scrollY);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < y) {
      if (scrollVelocity.get() < -3200) {
        setShow(true);
      }
    } else {
      setShow(false);
    }
    setY(latest);
  });
  return (
    <motion.div
      initial={{ top: 0 }}
      animate={show ? "show" : "hide"}
      variants={{
        show: {
          top: 0,
        },
        hide: {
          top: height,
          transition: {
            duration: 0.3,
            type: "tween",
            ease: "easeOut",
          },
        },
      }}
      className={className}
      style={{ backdropFilter: "blur(10px)" }}
    >
      {children}
    </motion.div>
  );
}
