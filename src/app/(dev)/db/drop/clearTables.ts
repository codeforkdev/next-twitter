import { db } from "@/drizzle/db";

export async function clearTables() {
  try {
    await db.delete(schema.conversations);
    await db.delete(schema.posts);
    await db.delete(schema.users);
    console.log("️✅   Clear tables");
  } catch (e) {
    console.log(chalk.red("⚠️   Error: Deleting users\n", e));
  }
}
