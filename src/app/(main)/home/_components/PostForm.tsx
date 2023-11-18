"use client";
import React, { useContext, useState } from "react";
import PostFormProvider, { PostFormContext } from "./PostFormProvider";
import TextareaAutoSize from "../../[handle]/(post)/[postid]/TextArea";
import Link from "next/link";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { UserContext } from "../../UserProvider";
import { Avatar } from "@/app/_components/Avatar";
import {
  CalendarCheck2,
  ChevronDown,
  Globe2,
  ImageIcon,
  ListTodoIcon,
  MapPin,
} from "lucide-react";
import { Spacer } from "@/app/_components/Spacer";
import { Controller } from "react-hook-form";
import { Input } from "@/app/(auth)/login/_components/CredentialAuth";
import { cn } from "@/lib/utils";
import { CircularProgressbar } from "react-circular-progressbar";

export default function Post() {
  return (
    <PostFormProvider>
      <PostForm />
    </PostFormProvider>
  );
}

export const PostForm = () => {
  const user = useContext(UserContext);

  const formCtx = useContext(PostFormContext);
  if (!formCtx) return null;
  const { submit } = formCtx;

  return (
    <form
      className="hidden gap-4   border-white/20 px-3 py-2 tablet:flex"
      onSubmit={submit}
    >
      <Link
        href={"/" + user.handle}
        className="my-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar src={user.avatar} className=" h-10 w-10" />
      </Link>

      <div className="flex-1">
        <AudienceSettings />
        <PostTextInput />
        <Poll />
        <AudienceIndicator />
        <div className="my-3 h-[1px] bg-white/20" />
        <div className="flex">
          <Options />
          <TextLimitProgress />
          <div className="ml-auto flex items-center gap-4">
            <button
              type="submit"
              className=" rounded-full bg-primary px-4 py-1 font-semibold text-white disabled:bg-primary/70 disabled:text-white/70"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const PostTextInput = () => {
  const { form, showPoll, showAudienceSettings } = useContext(PostFormContext);

  return (
    <TextareaAutoSize
      className="min-h-[45px] w-full resize-none bg-transparent text-xl outline-none placeholder:text-gray-400/70"
      placeholder={!showPoll ? "What is happenings?!" : "Ask a question"}
      {...form.register("text")}
      minRows={1}
      onFocus={showAudienceSettings}
    />
  );
};

const AudienceSettings = () => {
  const { audienceSettingsIsVisible, showPoll } = useContext(PostFormContext);
  if (showPoll) return null;
  return (
    <>
      {audienceSettingsIsVisible && (
        <div>
          <button
            onClick={(e) => e.stopPropagation()}
            className=" flex w-fit items-center gap-[2px] rounded-full border border-blue-300/50 px-3 py-[1px] text-sm text-primary"
          >
            <span className="font-semibold">Everyone</span>
            <ChevronDown size={17} />
          </button>

          <Spacer className="py-1" />
        </div>
      )}
    </>
  );
};

const AudienceIndicator = () => {
  return (
    <div className="flex items-center gap-[4.75px] pt-2 text-primary">
      <button className="flex items-center gap-2 text-[14px]">
        <Globe2 size={15} />
        <span>Everyone can reply</span>
      </button>
    </div>
  );
};

const NumberDropDown = ({
  onChange,
  label,
  length,
}: {
  onChange: (val: number) => void;
  label: string;
  length: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown.Root onOpenChange={setOpen}>
      <Dropdown.Trigger
        className={cn(
          "flex flex-1 justify-between rounded-lg border border-white/20 p-1.5 ",
          {
            "border-primary": open,
          },
        )}
      >
        <div className="flex flex-col gap-1 text-sm">
          <p
            className={cn("text-neutral-400", {
              "text-primary": open,
            })}
          >
            {label}
          </p>
          <p className="text-left">1</p>
        </div>
        <ChevronDown size={20} className="self-center stroke-neutral-400" />
      </Dropdown.Trigger>

      <Dropdown.Portal>
        <Dropdown.Content className="w-[180px] rounded-lg border border-neutral-700 bg-black text-white">
          {new Array(length).fill(null).map((_, i) => (
            <Dropdown.DropdownMenuItem
              key={i}
              className="px-2 hover:bg-primary"
              onSelect={() => onChange(i)}
            >
              {i}
            </Dropdown.DropdownMenuItem>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

const Poll = () => {
  const {
    form: { control },
    pollOptions,
    appendPollOption,
    showPoll,
    togglePoll,
  } = useContext(PostFormContext);
  if (!showPoll) return null;
  return (
    <div
      className="rounded-xl border border-neutral-700"
      onClick={(e) => e.preventDefault()}
    >
      <div className="gap-2 border-b border-white/20 p-4">
        <div className="flex flex-1 flex-col gap-2">
          {pollOptions.map((f, index) => (
            <Controller
              key={f.id}
              control={control}
              name={`poll.options.${index}.value`}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <div className="flex items-center">
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    containerStyles="rounded-lg flex-1"
                    placeholderStyles="text-neutral-400"
                    error={false}
                    name={name}
                    ref={ref}
                    placeholder={`Option ${index + 1} ${
                      index > 1 ? "(optional)" : ""
                    }`}
                    onClick={(e) => e.preventDefault()}
                  />
                </div>
              )}
            />
          ))}
          {pollOptions.length < 4 && (
            <button
              onClick={appendPollOption}
              className="my-2 w-full self-end rounded-lg border border-primary py-2 text-primary disabled:border-primary/30 disabled:text-primary/30"
            >
              Add option
            </button>
          )}
          <div className="flex gap-6">
            <Controller
              control={control}
              name="poll.expiry.days"
              render={({ field, fieldState, formState }) => (
                <NumberDropDown
                  onChange={field.onChange}
                  label={"Days"}
                  length={6}
                />
              )}
            />
            <Controller
              control={control}
              name="poll.expiry.hours"
              render={({ field, fieldState, formState }) => (
                <NumberDropDown
                  onChange={field.onChange}
                  label={"Hours"}
                  length={23}
                />
              )}
            />
            <Controller
              control={control}
              name="poll.expiry.minutes"
              render={({ field, fieldState, formState }) => (
                <NumberDropDown
                  onChange={field.onChange}
                  label={"Minutes"}
                  length={59}
                />
              )}
            />
          </div>
        </div>
      </div>

      <button
        onClick={togglePoll}
        className="w-full py-4 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        Remove poll
      </button>
    </div>
  );
};

const Options = () => {
  const { togglePoll } = useContext(PostFormContext);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-1 px-1 text-primary"
    >
      <Option>
        <ImageIcon size={18} />
      </Option>
      <Option>
        <span className="rounded-sm border border-primary text-[8px] font-semibold">
          GIF
        </span>
      </Option>
      <Option onClick={() => togglePoll()}>
        <ListTodoIcon size={18} />
      </Option>
      <Option>
        <CalendarCheck2 size={18} />
      </Option>
      <Option>
        <MapPin size={18} />
      </Option>
    </div>
  );
};

interface OptionProps extends React.ComponentPropsWithoutRef<"button"> {}
const Option = (props: OptionProps) => {
  return (
    <button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick && props.onClick(e);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary/10",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};

const TextLimitProgress = () => {
  const {
    form: { watch },
  } = useContext(PostFormContext);
  const length = watch("text")?.trim().length;
  if (!length) return null;
  return (
    <CircularProgressbar
      value={(length / 300) * 100}
      className=" h-6 w-6 stroke-white/30"
      styles={{
        path: { stroke: "#1d9bf0" },
      }}
    />
  );
};
