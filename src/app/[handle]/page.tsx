import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { handle: string } }) {
  const user = await db.query.users.findFirst({
    where: eq(users.handle, params.handle),
  });

  if (!user) {
    return <div>User does not exist</div>;
  }
  return <div>User ID: {user.id}</div>;
}
