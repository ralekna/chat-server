import {Namespace, Server} from "socket.io";
import Middleware from "../commands/middleware";
import ChatServer from "../index";
import Room from "../rooms/room";
import {
  convertPayloadToMessage,
  default as Message,
  isValidMessagePayload,
  MESSAGE_FORMAT,
  MessageType
} from "../message";

export default class NamespaceWrapper {

  public namespace!: Namespace;
  public chatServer!: ChatServer;
  public socketServer!: Server;

  constructor(
    public name: string,
    public middleware: Middleware[] = [],
    public rooms: Room[]
  ) {
  }

  public setServer(chatServer: ChatServer, socketServer: Server): void {
    this.chatServer = chatServer;
    this.socketServer = socketServer;


    this.middleware.forEach(middleware => middleware.setServer(socketServer));

    this.namespace = this.socketServer
      .of(this.name)
      .on(MessageType.CONNECTION, socket => {
        console.log('user connected', socket.id);
        this.middleware.reduce<Message | boolean | undefined>((message, middleware) => {
          if (message === false) {
            console.log('skipping');
            return false; // skip remaining middleware
          }

          if (middleware.constructor.prototype.hasOwnProperty('onConnect')) {
            if (message instanceof Message) {
              return middleware.onConnect(socket, message);
            }
            return middleware.onConnect(socket);
          } else {
            return message;
          }

        }, undefined);

        socket.on(MessageType.MESSAGE, (payload: any) => {

          let message: Message;

          // this could be also in a middleware but IMO it would complicate things
          if (!isValidMessagePayload(payload)) {
            socket.to(socket.id).emit(MessageType.NOTIFICATION, new Message(`Unacceptable message format! Correct format: ${MESSAGE_FORMAT}`, socket.id, null));
            console.log(`User [${socket.id}] tried to post malformed message`, payload);
            return;
          } else {
            message = convertPayloadToMessage(payload);
          }

          this.middleware.reduce<Message | false>((message, middleware) => {

            if (message === false) {
              return false; // skipp remaining middleware
            }

            if (middleware.constructor.prototype.hasOwnProperty('onMessage')) {
              return middleware.onMessage(socket, message);
            } else {
              return message;
            }

          }, message);
        });


        socket.on(MessageType.DISCONNECT, (reason: string) => {

          this.middleware.reduce<Message | false | undefined>((message, middleware) => {
            if (message === false) {
              return false; // skipp remaining middleware
            }

            if (middleware.constructor.prototype.hasOwnProperty('onDisconnect')) {
              return middleware.onDisconnect(socket, message);
            } else {
              return message;
            }

          }, new Message(reason, Object.keys(socket.rooms)));
        });

      });

    this.middleware.forEach(middleware => middleware.setNamespaceWrapper(this));
    this.middleware.forEach(middleware => middleware.setNamespace(this.namespace));

    this.rooms.forEach(room => {
      room.setNamespace(this.namespace);
      room.setServer(this.socketServer);
    });

  }
}