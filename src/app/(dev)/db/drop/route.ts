import db from "@/server/db";
import * as schema from "@/server/db/schema";

async function clearTables() {
  try {
    await db.delete(schema.conversations);
    await db.delete(schema.posts);
    await db.delete(schema.users);
    console.log("️✅   Clear tables");
  } catch (e) {}
}

export async function GET(request: Request) {
  await clearTables();
  // return {};

  return Response.json({});
}
