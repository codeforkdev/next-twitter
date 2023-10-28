"use client";
import { ArrowLeft, ArrowLeftIcon, Check, CheckIcon } from "lucide-react";
import Link from "next/link";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Checkbox from "@radix-ui/react-checkbox";

export default function Page() {
  return (
    <div>
      <Header />
      <div className="border-b border-white/20 p-4">
        <MessageRequestSettings />
      </div>

      <div className="flex flex-col gap-4 p-4">
        <ToggleMessageQuality />
        <ToggleReadReceipts />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <div className="flex items-center gap-8 px-4 py-3 text-white/80">
      <Link href="/settings/account">
        <ArrowLeftIcon />
      </Link>
      <p className="text-xl font-semibold">Direct Messages</p>
    </div>
  );
};

const MessageRequestSettings = () => {
  return (
    <section>
      <p className="font-semibold">Allow message requests from:</p>
      <div className="flex gap-2 text-sm">
        <span className="text-white/40">
          People you follow will always be able to message you.
        </span>
        <Link
          href="https://help.twitter.com/en/using-x/direct-messages#receive"
          target="_blank"
          className="text-primary"
        >
          Learn more
        </Link>
      </div>
      {/* options */}
      <div>
        <RadioGroup.Root
          defaultValue="everyone"
          className="flex flex-col gap-2"
        >
          <div className="flex justify-between">
            <label htmlFor="noone" className="text-sm">
              No one
            </label>
            <RadioGroup.Item
              value="noone"
              id="noone"
              className="h-5 w-5 cursor-default overflow-clip rounded-full border border-white/70 shadow-[0_2px_10px] shadow-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center bg-primary after:block  ">
                <CheckIcon size={14} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
          </div>

          <div className="flex justify-between">
            <label htmlFor="verified" className="text-sm">
              Verified users
            </label>
            <RadioGroup.Item
              value="verified"
              id="verified"
              className="h-5 w-5 cursor-default overflow-clip rounded-full border border-white/70 shadow-[0_2px_10px] shadow-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center bg-primary after:block  ">
                <CheckIcon size={14} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
          </div>

          <div className="flex justify-between">
            <label htmlFor="everyone" className="text-sm">
              Everyone
            </label>
            <RadioGroup.Item
              value="everyone"
              id="everone"
              className="h-5 w-5 cursor-default overflow-clip rounded-full border border-white/70 shadow-[0_2px_10px] shadow-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center bg-primary after:block  ">
                <CheckIcon size={14} />
              </RadioGroup.Indicator>
            </RadioGroup.Item>
          </div>
        </RadioGroup.Root>
      </div>
    </section>
  );
};

const ToggleMessageQuality = () => {
  return (
    <div>
      <div className="flex justify-between">
        <p>Filter low-quality messages</p>
        <Checkbox.Root
          defaultChecked
          id="c1"
          className="flex h-5 w-5 items-center justify-center rounded border"
        >
          <Checkbox.CheckboxIndicator className="bg-primary">
            <CheckIcon size={16} />
          </Checkbox.CheckboxIndicator>
        </Checkbox.Root>
      </div>
      <div>
        <p className="text-sm text-white/50">
          Hide message requests that have been detected as being potentially
          spam or low-quality. These will be sent to a separate inbox at the
          bottom of your message requests. You can still access them if you
          want.
          <span>
            <Link href="" className="text-primary">
              Learn more
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

const ToggleReadReceipts = () => {
  return (
    <div>
      <div className="flex justify-between">
        <p>Filter low-quality messages</p>
        <Checkbox.Root
          defaultChecked
          id="c1"
          className="flex h-5 w-5 items-center justify-center rounded border"
        >
          <Checkbox.CheckboxIndicator className="bg-primary">
            <CheckIcon size={16} />
          </Checkbox.CheckboxIndicator>
        </Checkbox.Root>
      </div>
      <div>
        <p className="text-sm text-white/50">
          Let people you’re messaging with know when you’ve seen their messages.
          Read receipts are not shown on message requests.
          <span>
            <Link href="" className="text-primary">
              Learn more
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};
