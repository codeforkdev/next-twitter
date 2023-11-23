export const PKURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:1999"
    : (process.env.NEXT_PUBLIC_VERCEL_URL as string);
