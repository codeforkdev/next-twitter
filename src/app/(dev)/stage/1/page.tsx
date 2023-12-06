"use client";
import useLiveState from "./useLiveState";

function Counter({ id, count }: { id: string; count: number }) {
  const [counter, setCounter] = useLiveState({
    room: id + ":counter",
    initialState: count,
  });

  const plus = () => setCounter(counter + 1);
  const minus = () => setCounter(counter - 1);

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button onClick={plus}>plus</button>
      <button onClick={minus}>minus</button>

      <p className="w-full">
        Counter {id}: {counter}
      </p>
    </div>
  );
}

function Poll({
  id,
  poll,
}: {
  id: string;
  poll: { id: string; votes: number }[];
}) {
  const [options, setOptions] = useLiveState({
    room: id + ":poll",
    initialState: poll,
  });
  const totalVotes = Object.values(options).reduce(
    (acc, curr) => (acc += curr.votes),
    0,
  );

  function vote(optionId: string) {
    setOptions(
      options.map((option) => {
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      }),
    );
  }
  return (
    <div>
      <p>Poll: {id}</p>
      <div className="flex flex-col">
        {options.map((option) => (
          <button
            key={option.id}
            className="h-5 w-full border"
            onClick={() => vote(option.id)}
          >
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${
                  option.votes === 0 ? 0 : (option.votes / totalVotes) * 100
                }%`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Counter id="1" count={1} />
      <Poll
        id="1"
        poll={[
          { id: "1", votes: 1 },
          { id: "2", votes: 0 },
          { id: "3", votes: 0 },
        ]}
      />
    </>
  );
}
