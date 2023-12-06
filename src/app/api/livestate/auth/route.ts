import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Get token");
  const apiKey = request.nextUrl.searchParams.get("apiKey");
  const clientId = request.nextUrl.searchParams.get("clientId");

  console.log(clientId, apiKey);

  if (clientId === "123" && apiKey === "456") {
    return Response.json({ authorized: true });
  } else {
    return Response.json({ authorized: false });
  }
}
