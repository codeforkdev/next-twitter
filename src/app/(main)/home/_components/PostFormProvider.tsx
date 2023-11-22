"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useState } from "react";
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { createGiphyPost, createPoll } from "../_actions";
import { UserContext } from "../../UserProvider";

const option = z.object({ value: z.string().trim() });
const options = option.array().transform(
  (data) =>
    data?.filter((o, i) => {
      if (i < 2 || o.value) return o;
    }),
);

const schema = z.object({
  text: z.string().min(1, { message: "Required" }),
  giphy: z.string().nullable(),
  poll: z.object({
    options,
    expiry: z.object({
      days: z.number(),
      hours: z.number(),
      minutes: z.number(),
    }),
  }),
});

type Schema = z.infer<typeof schema>;

type TPostFormContext = {
  form: UseFormReturn<Schema>;
  submit: () => void;
  appendPollOption: () => void;
  showPoll: boolean;
  togglePoll: () => void;
  audienceSettingsIsVisible: boolean;
  showAudienceSettings: () => void;
  hideAudienceSettings: () => void;
  pollOptions: FieldArrayWithId<
    {
      text: string;
      poll: {
        options: {
          value: string;
        }[];
        expiry: {
          days: number;
          hours: number;
          minutes: number;
        };
      };
    },
    "poll.options",
    "id"
  >[];
};

export const PostFormContext = createContext<TPostFormContext>(
  {} as TPostFormContext,
);

export default function PostFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(UserContext);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      poll: {
        options: [{ value: "" }, { value: "" }],
        expiry: {
          days: 1,
          hours: 0,
          minutes: 0,
        },
      },
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "poll.options",
    keyName: "id",
  });

  const [showPoll, setShowPoll] = useState(false);
  const [audienceSettingsIsVisible, setAudienceSettingsIsVisible] =
    useState(false);

  const showAudienceSettings = () => setAudienceSettingsIsVisible(true);
  const hideAudienceSettings = () => setAudienceSettingsIsVisible(false);
  const togglePoll = () => {
    setShowPoll(!showPoll);
  };

  const appendPollOption = () => append({ value: "" });

  const submit = form.handleSubmit((data) => {
    console.log("form data: ", data);
    const { text, poll, giphy } = data;

    console.log(data);

    if (showPoll) {
      if (!poll.options[0].value || !poll.options[1].value) return;

      createPoll({
        userId: user.id,
        text,
        options: poll.options.map((o) => o.value),
        expiry: poll.expiry,
      });
      togglePoll();
      form.reset();
      return;
    }

    if (giphy) {
      console.log("submit giphy post");
      createGiphyPost({
        userId: user.id,
        text,
        giphy,
      });
      form.reset();
    }
  });

  return (
    <PostFormContext.Provider
      value={{
        form,
        showPoll,
        togglePoll,
        appendPollOption,
        showAudienceSettings,
        hideAudienceSettings,
        audienceSettingsIsVisible,
        pollOptions: fields,
        submit,
      }}
    >
      {children}
    </PostFormContext.Provider>
  );
}
