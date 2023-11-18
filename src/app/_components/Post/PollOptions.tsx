"use client";

import { submitPollVote } from "./_actions";

type Props = {
  options: {
    id: string;
    text: string;
    pollId: string;
  }[];
  userId: string;
};

export default function PollOptions({ options, userId }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {options.map((option) => (
        <li className="w-full" key={option.id}>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await submitPollVote({
                optionId: option.id,
                pollId: option.pollId,
                userId,
              });
            }}
            className="h-full w-full rounded-full border border-primary p-1 text-center text-primary transition-colors hover:bg-primary/10"
          >
            {option.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
