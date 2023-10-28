import { UserSchemaNoPassword } from "@/app/db/stores/User";
import { ensureError } from "@/types";
import { JWTPayload, JWTVerifyResult, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const verifyJWT = async () => {
  const token = cookies().get("jwt")?.value;
  if (!token) {
    redirect("/login");
  }

  const secret = process.env.JWT_SECRET as string;

  if (!secret) {
    throw new Error("No secret found");
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string),
    );
    return verified as JWTVerifyResult<
      JWTPayload & { user: UserSchemaNoPassword }
    >;
  } catch (err) {
    const error = ensureError(err);
    return redirect("/login");
  }
};
