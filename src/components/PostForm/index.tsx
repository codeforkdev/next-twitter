"use client";
import { user } from "@/mock-data";
import { submitPost } from "@/actions";
import { useState } from "react";
import TextareaAutoSize from "react-textarea-autosize";

export default function PostForm() {
  const [text, setText] = useState("");
  return (
    <form
      action={(e) => {
        const cleanText = text.trim();
        if (!cleanText) return;
        submitPost({ userId: user.id, text: cleanText });
      }}
    >
      <TextareaAutoSize
        className="text-black"
        value={text}
        onInput={(e) => setText(e.currentTarget.value)}
      />
      <button
        type="submit"
        className="bg-sky-500 text-white py-1 px-4 rounded-full"
      >
        Send
      </button>
    </form>
  );
}
