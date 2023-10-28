import type * as Party from "partykit/server";
import { Payload } from "../types/types";

export default class PostServer implements Party.Server {
  constructor(readonly party: Party.Party) {}
  messages = [];

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {}

  onMessage(message: string, sender: Party.Connection) {
    this.party.broadcast(message);
  }

  async onRequest(request: Party.Request) {
    if (request.method === "POST") {
      console.log("porque mariaaaaaaaaa");
      const payload = await request.json<Payload>();

      console.log(payload);
      this.party.broadcast(JSON.stringify(payload));
    }
    return new Response("ok");
  }
}
