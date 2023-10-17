import { cn } from "@/lib/utils";
import Image from "next/image";
export const Avatar = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  return (
    <div
      className={cn("relative h-8 w-8 overflow-clip rounded-full", className)}
    >
      <Image src={src} alt="avatar" fill />
    </div>
  );
};
