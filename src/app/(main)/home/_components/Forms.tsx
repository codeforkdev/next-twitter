"use client";
import { useState } from "react";
import { PostForm } from "./PostForm";
import PollForm from "./PollForm";
import { CalendarCheck2, ImageIcon, ListTodoIcon, MapPin } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { cn } from "@/lib/utils";

export default function Forms() {
  return (
    <div>
      <PostForm />
    </div>
  );
}
