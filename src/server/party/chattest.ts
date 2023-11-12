import type * as Party from "partykit/server";

export default class PostServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(conn.uri);
    const sp = url.searchParams;
    const user = sp.get("user");
    const isTyping = sp.get("isTyping") === "false" ? false : true;
    conn.setState({ user, isTyping });
  }

  onMessage(message: string, sender: Party.Connection) {
    const { isTyping } = JSON.parse(message) as { isTyping: boolean };
    const state = sender.state as { user: string; isTyping: boolean };
    if (state.isTyping === isTyping) return;
    if (isTyping) {
      sender.setState({ ...sender.state, isTyping: true });
    } else {
      sender.setState({ ...sender.state, isTyping: false });
    }
    this.party.broadcast(JSON.stringify(sender.state), [sender.id]);
  }
}
