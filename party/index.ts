import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    // conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    console.log(message);
    this.party.broadcast(message);
    // let's log the message
    // console.log(`connection ${sender.id} sent message: ${message}`);
    // // as well as broadcast it to all the other connections in the room...
    // this.party.broadcast(
    //   `${sender.id}: ${message}`,
    //   // ...except for the connection it came from
    //   [sender.id]
    // );
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

Server satisfies Party.Worker;
