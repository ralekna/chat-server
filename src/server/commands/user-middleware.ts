import {Server, Socket} from "socket.io";
import Middleware, {executeTextCommand} from "./middleware";
import Message, {MessageType} from "../message";
import User from "../user";

export default class UserMiddleware extends Middleware{

  private users: {[socketId: string]: User} = {};

  execute(socket: Socket, message: Message): Message {
    let user = this.users[socket.id] || (this.users[socket.id] = new User(socket));

    return executeTextCommand(message, {
      nick(message, ...args) {
        let newName = args[0];
        if (!newName) {
          let errorMessage = new Message(new Date(), MessageType.NOTIFICATION,
            `Error: argument for new nickname wasn't provided`, user, undefined, undefined, true);
          socket.emit(MessageType.NOTIFICATION, errorMessage);
          return errorMessage;
        }
        return message;
      }
    });
  }
}