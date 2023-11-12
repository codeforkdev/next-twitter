import { z } from "zod";
import type * as Party from "partykit/server";

export const messageSchema = z.object({
  type: z.string(),
  data: z.object({
    user: z.object({ avatar: z.string(), isTyping: z.boolean() }),
  }),
});

export type MessageSchema = z.infer<typeof messageSchema>;

type Typer = { id: string; avatar: string };
export default class ConversationServer implements Party.Server {
  typers = [] as Typer[];

  constructor(readonly party: Party.Party) {}
  removeTyper(connId: string) {
    this.typers = this.typers.filter((typer) => typer.id !== connId);
    this.party.broadcast(JSON.stringify(this.typers));
  }

  addTyper(typer: Typer) {
    this.typers = [...this.typers, typer];
    this.party.broadcast(JSON.stringify(this.typers));
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    this.party.broadcast(JSON.stringify(this.typers));
  }

  onMessage(message: string, sender: Party.Connection) {
    const { type, data } = messageSchema.parse(JSON.parse(message));
    if (type === "typing") {
      if (data.user.isTyping) {
        this.addTyper({
          id: sender.id,
          avatar: data.user.avatar,
        });
      } else {
        this.removeTyper(sender.id);
      }
    }
  }

  onClose(conn: Party.Connection) {
    this.removeTyper(conn.id);
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
