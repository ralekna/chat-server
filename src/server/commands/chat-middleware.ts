import Middleware from "./middleware";
import {Socket} from "socket.io";
import Message from "../message";
import {Injectable} from "container-ioc";

@Injectable()
export default class ChatMiddleware extends Middleware {

  onMessage(socket: Socket, message: Message): Message | false {
    if (message.text && !(message.text.indexOf('/') === 0)) {
      socket.to(message.room as string).broadcast.send(message);
      return false;
    }
    return message;
  }

}