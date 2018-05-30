import Middleware from "./middleware";
import Message from "../message";
import {Server, Socket} from "socket.io";

export default class NumberGenerationMiddleware extends Middleware  {
  execute(socket: Socket, message: Message): Message {
    return undefined;
  }

  setServer(server: Server) {

  }


}