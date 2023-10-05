import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: "libsql://next-twitter-codeforkdev.turso.io",
    authToken:
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEwLTA0VDA2OjAyOjA0Ljk5NTgzNTc3M1oiLCJpZCI6ImJhZTg5MTYyLTYyM2UtMTFlZS04NjY3LWNhOTJkYTczNTc4YyJ9.mm7-4xQB5H_proPQatBqTcRkFS3dQuNuOVn0vGSrlvAF-e0QO7rsDM7eRmiFQdkAISQn3O5efMh0s31IfecpCg",
  },
} satisfies Config;
