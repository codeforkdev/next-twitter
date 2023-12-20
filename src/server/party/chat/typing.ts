import * as Party from "partykit/server";

type Typer = { id: string; avatar: string };

export default class PostServer implements Party.Server {
  typers = [] as Typer[];
  constructor(readonly party: Party.Party) {}

  removeTyper(id: string) {
    this.typers = this.typers.filter((typer) => typer.id !== id);
    this.party.broadcast(JSON.stringify({ typers: this.typers }));
  }

  addTyper(typer: Typer) {
    this.typers = [...this.typers, typer];
    this.party.broadcast(JSON.stringify({ typers: this.typers }));
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("Connected to Chat typing socket");
  }

  onMessage(message: string, sender: Party.Connection) {
    console.log(message);
    // this.party.broadcast(message, [sender.id]);
  }

  async onRequest(request: Party.Request) {
    console.log("HTTP Request");

    if (request.method === "POST") {
      const payload = await request.json<any>();
      console.log(payload);
      this.party.broadcast(JSON.stringify(payload));
      return new Response(JSON.stringify(payload));
    }

    return new Response(JSON.stringify({}));
  }
}
