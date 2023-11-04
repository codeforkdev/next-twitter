import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config, connect } from "@planetscale/database";
import * as schema from "./schema";
const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
} satisfies Config;

const connection = connect(config);

export default drizzle(connection, { schema });
