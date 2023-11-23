import db from "@/server/db";
import * as schema from "@/server/db/schema";
import chalk from "chalk";

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
