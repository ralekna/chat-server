import Middleware from "./middleware";
import Message, {MessageType} from "../message";
import {setInterval} from "timers";

export default class NumberGenerationMiddleware extends Middleware  {

  setRoom(room: string) {
    this.room = room;
    setInterval(() => {
      if (this.namespace) {
        this.namespace
          .to(this.room)
          .emit(MessageType.NOTIFICATION, new Message(Math.random().toString(10), this.room))
      }
    }, 5000);

  }

}