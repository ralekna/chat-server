import SocketIO, {Namespace, Server} from 'socket.io';
import Express from 'express';
import Http from 'http';
import Middleware from "./commands/middleware";
import Room from "./rooms/room";
import NamespaceWrapper from "./namespaces/namespace";

export default class ChatServer {

  public socketServer!: Server;

  constructor(
    private port: number,
    private namespaces: NamespaceWrapper[]) {
  }

  public init(): void {

    let app = Express();

    let server = Http.createServer(app);

    this.socketServer = SocketIO(server);

    if (this.socketServer) {
      this.namespaces.forEach(namespaceWrapper => {
        namespaceWrapper.setServer(this, this.socketServer);
      })
    }

    server.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    });

    console.log('starting server');
  }
}