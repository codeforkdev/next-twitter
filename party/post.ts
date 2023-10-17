import type * as Party from "partykit/server";

export default class PostServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {}

  onMessage(message: string, sender: Party.Connection) {
    this.party.broadcast(message);
  }

  async onRequest(request: Party.Request) {
    if (request.method === "POST") {
      console.log("porque mariaaaaaaaaa");
      const payload = await request.json<{
        likes: number;
      }>();

      this.party.broadcast(JSON.stringify(payload));
    }
    return new Response("ok");
  }
}
