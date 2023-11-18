"use client";

import { UserContext } from "@/app/(main)/UserProvider";
import { useContext } from "react";
import { submitPollVote } from "./_actions";

type Props = {
  id: string;
  text: string;
  pollId: string;
};
export default function PollOption({ id, text, pollId }: Props) {
  const user = useContext(UserContext);
  return (
   
  );
}
