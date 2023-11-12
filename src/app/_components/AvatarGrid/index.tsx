import { cn } from "@/lib/utils";
import Image from "next/image";
export function AvatarGrid({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  const count = images.length;
  return (
    <div
      className={cn(
        "relative h-20 w-20 overflow-clip rounded-full",
        className,
        {
          "grid grid-cols-2": count > 1,
          "grid-rows-2": count > 2,
        },
      )}
    >
      {images.map((image, i) => (
        <div
          key={i}
          className={cn("relative", {
            "h-full w-full": count === 1,
            "col-span-1 row-span-2": count === 3 && i === 1,
          })}
        >
          <Image src={image} alt="" fill style={{ objectFit: "cover" }} />
        </div>
      ))}
    </div>
  );
}
