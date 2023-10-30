import type * as Party from "partykit/server";

export default class ConversationServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {}

  onMessage(message: string, sender: Party.Connection) {
    this.party.broadcast(message);
  }

  async onRequest(request: Party.Request) {
    if (request.method === "POST") {
      const payload = await request.json<{
        id: string;
        conversationId: string;
        participantId: string;
        text: string;
      }>();

      this.party.broadcast(JSON.stringify(payload));
    }
    return new Response("ok");
  }
}

ConversationServer satisfies Party.Worker;
