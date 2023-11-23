"use client";
import { ReactionsContext } from "@/app/_components/Post/Reactions";
import { useContext } from "react";

export default function Views() {
  const { views } = useContext(ReactionsContext);
  return <span>{views} views</span>;
}
