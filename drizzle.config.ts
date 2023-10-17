import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString:
      'mysql://x2s6mmi6ufo140gji8r1:pscale_pw_mdz5zmTS1gxu9xLSVpRh3cOfxSgL5DHIZXM5aOReqhP@aws.connect.psdb.cloud:3306/next-twitter?ssl={"rejectUnauthorized":true}',
  },
} satisfies Config;
