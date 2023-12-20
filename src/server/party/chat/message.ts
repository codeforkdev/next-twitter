import type * as Party from "partykit/server";

export default class PostServer implements Party.Server {
  constructor(readonly party: Party.Party) {}
  messages = [];

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("Connected to message chat messaging socket");
  }

  onMessage(message: string, sender: Party.Connection) {
    this.party.broadcast(message, [sender.id]);
  }

  async onRequest(request: Party.Request) {
    if (request.method === "POST") {
      const payload = await request.json<any>();
      console.log(payload);
      this.party.broadcast(JSON.stringify(payload));
    }
    return new Response("ok");
  }
}
