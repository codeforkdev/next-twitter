"use client";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useVelocity,
} from "framer-motion";
import { useState } from "react";

export const ScrollInView = ({
  children,
  className,
  top,
}: {
  top: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const [y, setY] = useState(scrollY.get());
  const [show, setShow] = useState(y === 0 ? true : false);
  const scrollVelocity = useVelocity(scrollY);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < y) {
      if (scrollVelocity.get() < -1500) {
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
          top,
          transition: {
            duration: 0.3,
            type: "tween",
            ease: "easeOut",
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
