import {Server, Socket} from "socket.io";
import Message from "../message";

export default abstract class Middleware {
  public server?: Server = undefined;

  setServer(server: Server): void {
    this.server = server;
  }
  abstract execute(socket: Socket, message: Message): Message;
};

export function executeTextCommand(
  message: Message,
  commands: {
    [commandName: string]: (message: Message, ...args: string[]) => Message
  }): Message {
  if (message.text && message.text.indexOf('/') === 0) {
    let [command, ...args] = message.text.replace(/^\//, '').split(/\s+/);
    if (commands[command]) {
      return commands[command](message, ...args);
    }
    return message;
  }
  return message;
}