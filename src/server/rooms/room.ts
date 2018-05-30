import Middleware from "../commands/middleware";
import {Namespace, Server} from "socket.io";

export default class Room {

  public namespace!: Namespace;
  public server!: Server;

  constructor(
    public name: string,
    public middleware: Middleware[] = []
  ) {
    this.middleware.forEach(middleware => middleware.setRoom(name));
  }

  setNamespace(namespace: Namespace): void {
    this.namespace = namespace;
    this.middleware.forEach(middleware => middleware.setNamespace(namespace))
  }

  setServer(server: Server): void {
    this.server = server;
    this.middleware.forEach(middleware => middleware.setServer(server));
  }

}