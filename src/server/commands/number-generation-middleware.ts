import Middleware from "./middleware";
import Message, {MessageType} from "../message";
import {setInterval} from "timers";
import SERVER_BOT_USER from "../users/server-bot-user";

export default class NumberGenerationMiddleware extends Middleware  {

  private numbers: number[] = Array.from(new Array(100), (item, index) => index + 1).concat([0x29a]);

  private getRandomNumber(): number {
    return this.numbers[Math.floor(Math.random() * 101)];
  }

  constructor() {
    super();
    console.log(this.numbers);
  }

  setRoom(room: string) {
    this.room = room;
    setInterval(() => {
      let number = this.getRandomNumber();
      console.log('random number', number);
      if (this.namespace) {
        this.namespace
          .to(this.room)
          .emit(MessageType.NOTIFICATION, new Message(`Number is ${number.toString(10)}`, this.room, SERVER_BOT_USER))
      }
    }, 5000);

  }

}