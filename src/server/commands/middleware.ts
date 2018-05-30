import {Namespace, Server, Socket} from "socket.io";
import Message from "../message";
import NamespaceWrapper from "../namespaces/namespace";

export default abstract class Middleware {
  public server!: Server;
  public room!: string;
  public namespace!: Namespace;
  public namespaceWrapper!: NamespaceWrapper;

  setServer(server: Server): void {
    this.server = server;
  }

  setRoom(room: string): void {
    this.room = room;
  }

  setNamespaceWrapper(namespaceWrapper: NamespaceWrapper): void {
    this.namespaceWrapper = namespaceWrapper;
  }

  setNamespace(namespace: Namespace): void {
    this.namespace = namespace;
  }

  onMessage(socket: Socket, message: Message): Message | false {
    return message ? message : false;
  }

  onConnect(socket: Socket, message?: Message): Message | false {
    return message ? message : false;
  };

  onDisconnect(socket: Socket, message?: Message): Message | false {
    return message ? message : false;
  };
};

export function executeTextCommand(
    message: Message,
    commands: {[commandName: string]: (message: Message, ...args: string[]) => Message | false}
  ): Message | false {

  if (message.text && message.text.indexOf('/') === 0) {
    let [command, ...args] = message.text.replace(/^\//, '').split(/\s+/);
    if (commands.hasOwnProperty(command)) {
      return commands[command](message, ...args);
    }
    return message;
  }
  return message;
}