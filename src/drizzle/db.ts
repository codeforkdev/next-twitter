import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://next-twitter-codeforkdev.turso.io",
  authToken: process.env.DB_TOKEN,
});

export const db = drizzle(client, { schema });
