import Middleware from "../commands/middleware";
import {Namespace, Server} from "socket.io";

export default class Room {

  constructor(
    public name: string,
    public namespace: Namespace,
    public server: Server,
    public messageMiddleware: Middleware[] = [],
    public connectMiddleware: Middleware[] = []
  ) {
    this.namespace = this.server
      .of(this.name)
      .on('connection', socket => {

      })
  }
}