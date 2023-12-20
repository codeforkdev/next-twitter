import { z } from "zod";
import type * as Party from "partykit/server";

export const messageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  text: z.string(),
  createdAt: z.coerce.date(),
  handle: z.string(),
  avatar: z.string(),
  displayName: z.string(),
});

export const sendingSchema = z
  .object({
    type: z.literal("message"),
    message: z.any(),
  })
  .or(
    z
      .object({
        type: z.literal("typing"),
        avatar: z.string(),
        typing: z.literal(true),
      })
      .or(
        z.object({
          type: z.literal("typing"),
          typing: z.literal(false),
        }),
      ),
  );

export type SendingSchema = z.infer<typeof sendingSchema>;

export const returningSchema = z
  .object({
    type: z.literal("message"),
    message: z.any(),
  })
  .or(
    z.object({
      type: z.literal("typing"),
      typers: z
        .object({
          connId: z.string(),
          avatar: z.string(),
        })
        .array(),
    }),
  );

export type MessageSchema = z.infer<typeof messageSchema>;

type Typer = { connId: string; avatar: string };
export default class ConversationServer implements Party.Server {
  typers = [] as Typer[];

  constructor(readonly party: Party.Party) {}
  removeTyper(connId: string) {
    this.typers = this.typers.filter((typer) => typer.connId !== connId);
    this.party.broadcast(
      JSON.stringify({ type: "typing", typers: this.typers }),
    );
  }

  addTyper(typer: Typer) {
    this.typers = [...this.typers, typer];
    this.party.broadcast(
      JSON.stringify({ type: "typing", typers: this.typers }),
    );
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("connected 🌊");
    conn.send(JSON.stringify({ type: "typing", typers: this.typers }));
  }

  onMessage(message: string, sender: Party.Connection) {
    const json = JSON.parse(message);
    const data = sendingSchema.parse(json);

    switch (data.type) {
      case "message":
        console.log(data.message);
        this.party.broadcast(JSON.stringify(data));
        break;
      case "typing":
        data.typing
          ? this.addTyper({
              connId: sender.id,
              avatar: data.avatar,
            })
          : this.removeTyper(sender.id);
        break;
    }
  }

  onClose(conn: Party.Connection) {
    this.removeTyper(conn.id);
  }
}

ConversationServer satisfies Party.Worker;
