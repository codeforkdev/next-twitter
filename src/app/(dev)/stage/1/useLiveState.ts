import { PKURL } from "@/app/_components/Post/constants";
import usePartySocket from "partysocket/react";
import { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { LiveStateContext } from "./LiveStateProvider";

export default function useLiveState<T>({
  room,
  initialState,
}: {
  room: string;
  initialState: T;
}) {
  const { sessionId, appId } = useContext(LiveStateContext);
  const [state, updater] = useImmer<T>(initialState);
  const ws = usePartySocket({
    host: "https://livestates-api-party.codeforkdev.partykit.dev",
    room,
    party: "livestate",
    query: { sessionId, appId },
    onMessage: (evt: MessageEvent) => {
      const data = JSON.parse(evt.data) as T;

      if (Array.isArray(data)) {
        updater(data);
        return;
      }

      if (typeof data !== "object") {
        updater(data);
        return;
      }

      updater((draft) => {
        console.log({ ...draft, ...data });
        const v = { ...draft, ...data };
        return v;
      });
    },
  });

  ws.room = "main";

  function setState(data: Partial<T>) {
    ws.send(JSON.stringify(data));
  }

  useEffect(() => {
    console.log("val updated", state);
  }, [state]);

  return [state, setState] as const;
}
