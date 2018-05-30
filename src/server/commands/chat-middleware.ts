import Middleware from "./middleware";
import {Server, Socket} from "socket.io";
import Message from "../message";

export default class ChatMiddleware extends Middleware {

  execute(socket: Socket, message: Message): Message {
    if (message.text && !(message.text.indexOf('/') === 0)) {
      socket.broadcast.emit("message", message);
    }
    return message;
  }

}