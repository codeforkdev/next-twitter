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

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {}

  onMessage(message: string, sender: Party.Connection) {}

  onClose(conn: Party.Connection) {}

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
