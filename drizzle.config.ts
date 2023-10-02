import type { Config } from "drizzle-kit";
 
export default {
  schema: "./src/drizzle/schema.ts",
  driver: 'mysql2',
  dbCredentials: {
    connectionString:'mysql://root:4WCpIo8BxqCjI7245aw1@containers-us-west-79.railway.app:6922/railway' ,
  }
} satisfies Config;