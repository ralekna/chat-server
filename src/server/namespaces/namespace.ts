import {Namespace, Server} from "socket.io";
import Middleware from "../commands/middleware";
import ChatServer from "../index";
import Room from "../rooms/room";
import {default as Message, MessageType} from "../message";

export default class NamespaceWrapper {

  public namespace!: Namespace;
  public chatServer!: ChatServer;
  public socketServer!: Server;

  constructor(
    public name: string,
    public messageMiddleware: Middleware[] = [],
    public connectMiddleware: Middleware[] = [],
    public disconnectMiddleware: Middleware[] = [],
    public rooms: Room[]
  ) {
  }

  public setServer(chatServer: ChatServer, socketServer: Server): void {
    this.chatServer = chatServer;
    this.socketServer = socketServer;


    this.messageMiddleware.forEach(middleware => middleware.setServer(socketServer));
    this.connectMiddleware.forEach(middleware => middleware.setServer(socketServer));
    this.disconnectMiddleware.forEach(middleware => middleware.setServer(socketServer));

    this.namespace = this.socketServer
      .of(this.name)
      .on(MessageType.CONNECTION, socket => {
        this.connectMiddleware.reduce((message, middleware) => {
          return middleware.execute(socket, message);
        }, new Message(new Date(), MessageType.CONNECTION, '', null, this, socket.id));

        socket.on(MessageType.MESSAGE, (senderId: string, payload: any) => {

        })
      });

  }
}