import { z } from "zod";
import { users } from "./server/db/schema";

export type User = typeof users.$inferSelect;

// export type Result<T, E extends BaseError = BaseError> =
export type Result<T> =
  | { success: true; result: T }
  | { success: false; error: string };

export const CredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type Credentials = z.infer<typeof CredentialsSchema>;

export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

export class BaseError extends Error {
  public readonly context?: Jsonable;
  constructor(
    message: string,
    options: { cause?: Error; context?: Jsonable } = {},
  ) {
    const { cause, context } = options;

    super(message, { cause });
    this.name = this.constructor.name;

    this.context = context;
  }
}

export class AuthError extends BaseError {
  public readonly message = "Failed authentication";
  constructor(
    message: string,
    options: { cause?: Error; context?: Jsonable } = {},
  ) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export function ensureError(value: unknown): BaseError {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new BaseError(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );
  return error;
}
