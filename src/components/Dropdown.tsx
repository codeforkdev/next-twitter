"use client";
import { cn } from "@/lib/utils";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

type Props = {
  label: string;
  className: string;
  defaultValue: string;
};
export function Options(props: Props) {
  const { label, className, defaultValue } = props;
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Select.Root defaultValue={defaultValue}>
      <Select.Trigger asChild ref={ref}>
        <button
          className={cn("flex h-full w-full justify-between py-1", className)}
        >
          <div className="px-2">
            <p className="text-left text-xs text-neutral-500">{label}</p>
            <Select.Value />
          </div>
          <div className="flex h-full items-center px-2">
            <ChevronDown className="text-neutral-500" />
          </div>
        </button>
      </Select.Trigger>
      <Select.Content
        position="popper"
        className=" max-w-full  bg-black text-white"
        style={{ width: `${ref.current?.getBoundingClientRect().width}px` }}
      >
        <Select.Item value="apple" className="relative flex items-center">
          Apple
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
