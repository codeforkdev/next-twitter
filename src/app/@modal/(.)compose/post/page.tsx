"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  CalendarCheck2,
  ChevronDown,
  Globe,
  Globe2,
  ImageIcon,
  ListTodoIcon,
  MapPin,
  MoveLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function Modal() {
  const router = useRouter();
  return (
    <Dialog.Root
      defaultOpen={true}
      onOpenChange={(open) => {
        !open && router.back();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black" />

        <Dialog.Content className="z-50 fixed top-0 left-0  w-full px-4 bg-black">
          <div className="flex flex-col  ">
            <header className="flex items-center gap-[30px] h-[54px]">
              <ArrowLeft onClick={() => router.back()} size={21} />
              <Link
                href="/compose/post/unsent/drafts"
                className="text-primary ml-auto text-sm font-semibold"
              >
                Drafts
              </Link>
              <button className="py-[7px] px-[17px] rounded-full bg-primary opacity-50 text-sm">
                Post
              </button>
            </header>
            <main className="pt-[15px]">
              <div className="flex flex-col">
                <div className="flex gap-[14px] min-h-56">
                  <div className="h-10 w-10 rounded-full overflow-clip  relative ">
                    <Image
                      src="https://avatars.githubusercontent.com/u/142317935?v=4"
                      alt=""
                      fill
                    />
                  </div>

                  <div className="min-h-[160px] flex-1 flex flex-col gap-[14px] ">
                    <button className=" text-primary text-sm border border-blue-300/50 rounded-full px-3 py-[1px] flex items-center gap-[2px] -mt-[6px] w-fit">
                      <span className="font-semibold">Everyone</span>
                      <ChevronDown size={17} />
                    </button>
                    <label
                      htmlFor="text"
                      className="flex-1  min-h-[110px]  max-h-[250px]
                       overflow-y-auto h-full "
                    >
                      <ReactTextareaAutosize
                        id="text"
                        placeholder="What is happening?!"
                        className="bg-transparent text-xl placeholder:text-white/40 w-full resize-none h-full outline-none"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-[4.75px] text-primary items-center pt-[8px]  pb-[13px] pl-[6.25px] ">
                  <Globe2 size={15} />
                  <button className="text-[14px] ">Everyone can reply</button>
                </div>
              </div>
            </main>
          </div>

          <div className="bg-white/20 h-[1px] -mx-[8px]" />
          <div className="flex gap-[18px] h-[62px] items-center text-primary px-1">
            <ImageIcon size={18} />
            <button className="text-[8px] border border-primary rounded-sm font-semibold">
              GIF
            </button>
            <ListTodoIcon size={20} />
            <CalendarCheck2 size={19} />
            <MapPin size={17} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
