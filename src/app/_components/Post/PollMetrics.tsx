"use client";

import { CheckCircleIcon } from "lucide-react";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { PKURL } from "./constants";

type Option = {
  id: string;
  text: string;
  pollId: string;
  votes: number;
};

type Props = {
  options: Option[];
  votes: number;
  userVote: {
    id: string;
    createdAt: Date;
    pollId: string;
    optionId: string;
    voterId: string;
  };
  pollId: string;
};
export default function PostMetrics(props: Props) {
  const [options, setOptions] = useState(props.options);
  const [votes, setVotes] = useState(props.votes);
  const ws = usePartySocket({
    host: PKURL,
    party: "poll",
    room: props.pollId,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data) as Option[];
      setOptions(data);
      const v = data.reduce((acc, curr) => {
        acc += curr.votes;
        return acc;
      }, 0);
      setVotes(v);
    },
  });

  return (
    <ul className="flex flex-col gap-1">
      {options.map((option) => {
        const progress = Math.floor((option.votes / votes) * 100);
        return (
          <li
            key={option.id}
            className="relative flex justify-between overflow-clip rounded text-sm"
          >
            <div
              className={`absolute h-full bg-neutral-700 transition-all duration-1000`}
              style={{
                width: `${progress > 0 ? progress : 1}%`,
              }}
            />
            <div className="z-10 flex w-full justify-between px-4 py-1">
              <div className="flex items-center gap-2">
                <p>
                  {option.text} {option.votes}{" "}
                </p>
                <p>
                  {props.userVote.optionId === option.id && (
                    <CheckCircleIcon size={14} />
                  )}
                </p>
              </div>
              <p>{progress}%</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
