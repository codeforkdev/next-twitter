"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { createGiphyPost, createImagePost, createPoll } from "../_actions";
import { UserContext } from "../../UserProvider";

const requiredOption = z.object({
  value: z.string().trim().min(1, { message: "Required" }),
});

const options = z
  .tuple([requiredOption, requiredOption])
  .rest(z.object({ value: z.string().trim() }));
// const options = option.array().transform(
//   (data) =>
//     data?.filter((o, i) => {
//       if (i < 2 || o.value) return o;
//     }),
// );

const schema = z.object({
  text: z.string().min(1, { message: "Required" }),
  giphy: z.string().nullable(),
  image: z.any().nullable(),
  poll: z
    .object({
      options,
      // expiry: z.object({
      //   days: z.number(),
      //   hours: z.number(),
      //   minutes: z.number(),
      // }),
    })
    .nullable(),
});

type Schema = z.infer<typeof schema>;

type TPostFormContext = {
  form: UseFormReturn<Schema>;
  submit: () => void;
  showPoll: boolean;
  togglePoll: () => void;
  audienceSettingsIsVisible: boolean;
  showAudienceSettings: () => void;
  hideAudienceSettings: () => void;
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
      giphy: null,
      poll: null,
      // poll: {
      //   options: [{ value: "" }, { value: "" }],
      //   expiry: {
      //     days: 1,
      //     hours: 0,
      //     minutes: 0,
      //   },
      // },
    },
  });

  useEffect(() => {
    console.log("ERRORS", form.formState.errors);
  }, [form.formState.errors]);

  const [showPoll, setShowPoll] = useState(false);
  const [audienceSettingsIsVisible, setAudienceSettingsIsVisible] =
    useState(false);

  const showAudienceSettings = () => setAudienceSettingsIsVisible(true);
  const hideAudienceSettings = () => setAudienceSettingsIsVisible(false);
  const togglePoll = () => {
    setShowPoll(!showPoll);
  };

  const submit = form.handleSubmit(async (data) => {
    console.log("form data: ", data);
    const { text, poll, giphy, image } = data;

    if (poll) {
      if (!poll.options[0].value || !poll.options[1].value) return;

      createPoll({
        userId: user.id,
        text,
        options: poll.options.map((o) => o.value),
        expiry: { days: 1, hours: 1, minutes: 1 },
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
      return;
    }

    if (image) {
      console.log(image[0]);
      console.log("submit image post");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: image[0],
      });
      const data = await response.json();

      if (data.ok) {
        console.log("create post");
        createImagePost({ userId: user.id, text, imageUrl: data.blob.url });
      }
    }
  });

  return (
    <PostFormContext.Provider
      value={{
        form,
        showPoll,
        togglePoll,
        showAudienceSettings,
        hideAudienceSettings,
        audienceSettingsIsVisible,
        submit,
      }}
    >
      {children}
    </PostFormContext.Provider>
  );
}
