import { cn } from "@/lib/utils";

export default function Loading({
  show,
  size,
}: {
  show: boolean;
  size: string;
}) {
  return (
    <div
      className={cn(
        "   animate-spin rounded-full border-4 border-gray-300/50 border-t-primary",
        { "opacity-0": !show },
        size,
      )}
    />
  );
}
