import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: "libsql://next-twitter-codeforkdev.turso.io",
    authToken:
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEwLTA2VDEzOjI3OjI2LjA5ODQzOTk3NloiLCJpZCI6ImZlZWRjYjgwLTY0NGItMTFlZS1hOTkwLWFlOGUzZmFkNmZmYSJ9.o59NJsYiQzpuf1W3aaPynAiCUfafEuATLZ7n5s0OOhktIvrAhE-BXQuMnLgMcKFHSCUNVxKgkn6_PbYf9x_jBw",
  },
} satisfies Config;
