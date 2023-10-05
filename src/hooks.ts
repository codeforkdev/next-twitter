import { useState } from "react";

export const useDebounce = () => {
  const [id, setId] = useState<NodeJS.Timeout>();
  const [isRunning, setIsRunning] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const queue = (cb: () => Promise<void>, ms: number = 500) => {
    if (id) cancel();
    setIsWaiting(true);
    setId(
      setTimeout(() => {
        run(cb);
      }, ms)
    );
  };

  const run = async (cb: () => Promise<void>) => {
    setIsWaiting(false);
    setIsRunning(true);
    await cb();
    setIsRunning(false);
  };

  const cancel = () => {
    setIsWaiting(false);
    clearTimeout(id);
  };

  return { queue, isWaiting, isRunning, cancel };
};
