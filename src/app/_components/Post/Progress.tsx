import { cn } from "@/lib/utils";
import { CircularProgressbar } from "react-circular-progressbar";
type Props = {
  max: number;
  length: number;
  className?: string;
};
export default function PostProgress(props: Props) {
  const progress = (props.length / props.max) * 100;
  return (
    <CircularProgressbar
      value={progress}
      className={cn("ml-auto h-6 w-6 stroke-white/30", props.className)}
      styles={{
        path: { stroke: "#1d9bf0" },
      }}
    />
  );
}
