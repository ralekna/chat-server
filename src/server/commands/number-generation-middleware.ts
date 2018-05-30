import Middleware from "./middleware";
import Message, {MessageType} from "../message";
import {Server, Socket} from "socket.io";
import {setInterval} from "timers";

export default class NumberGenerationMiddleware extends Middleware  {

  setRoom(room: string) {
    this.room = room;
    setInterval(() => {
      this.namespaceWrapper.namespace
        .to(this.room)
        .emit(MessageType.NOTIFICATION, new Message(Math.random().toString(10), this.room))
    }, 5000);

  }

}