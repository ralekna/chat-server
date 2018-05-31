import Middleware from "./middleware";
import Message, {MessageType} from "../message";
import {setInterval} from "timers";
import SERVER_BOT_USER from "../users/server-bot-user";

export default class NumberGenerationMiddleware extends Middleware  {

  private numbers: number[] = Array.from(new Array(99), ([,index]) => index + 1).concat([0x26a]);

  private getRandomNumber(): number {
    return this.numbers[Math.floor(Math.random() * 102)];
  }

  setRoom(room: string) {
    this.room = room;
    setInterval(() => {
      if (this.namespace) {
        this.namespace
          .to(this.room)
          .emit(MessageType.NOTIFICATION, new Message(`Number is ${this.getRandomNumber().toString(10)}`, this.room, SERVER_BOT_USER))
      }
    }, 5000);

  }

}