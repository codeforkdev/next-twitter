// server.ts
import type * as Party from "partykit/server";

export default class WebSocketServer implements Party.Server {
  constructor(readonly party: Party.Party) {}
  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    const clientId = new URL(request.url).searchParams.get("clientId") ?? "";
    return request;
  }

  onConnect(
    connection: Party.Connection<unknown>,
    { request }: Party.ConnectionContext,
  ): void | Promise<void> {
    console.log(connection.id, "connected");
  }

  onMessage(
    message: string | ArrayBuffer,
    sender: Party.Connection<unknown>,
  ): void | Promise<void> {
    console.log(message);
    this.party.broadcast(message as string);
  }
}

WebSocketServer satisfies Party.Worker;
