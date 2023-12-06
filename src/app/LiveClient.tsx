"use server";
import LiveStateProvider from "./(dev)/stage/1/LiveStateProvider";

export async function LiveStateClient({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const appId = process.env.LIVESTATE_APPID;
  const key = process.env.LIVESTATE_API_KEY;
  if (!appId) throw new Error("Missing env variable: LIVESTATE_APPID");
  if (!key) throw new Error("Missing env variable: LIVESTATE_API_KEY");

  const response = await fetch(
    `https://api.livestates.dev/api/session/create?appId=${appId}&key=${key}`,
    { next: { revalidate: 0 } },
  );
  const data = await response.json();

  if (!data.ok) throw new Error("invalid api key");
  return (
    <LiveStateProvider
      context={{ appId: data.appId, sessionId: data.sessionId }}
    >
      {children}
    </LiveStateProvider>
  );
}
