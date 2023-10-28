import { verifyJWT } from "@/lib/auth";

export default async function Page() {
  const {
    payload: { user },
  } = await verifyJWT();

  return (
    <>
      <div>Protected</div>
      <div>Welcome {user.handle}</div>
    </>
  );
}
