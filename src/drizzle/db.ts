import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  host: "containers-us-west-79.railway.app",
  user: "root",
  database: "railway",
  uri: process.env.DB_URL,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
