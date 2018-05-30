import User from "./user";
import {Namespace} from "socket.io";
import NamespaceWrapper from "./namespaces/namespace";

export default class Message {
  constructor(
    public timestamp: Date,
    public type: MessageType.MESSAGE | MessageType.CONNECTION | MessageType.NOTIFICATION,
    public text?: string,
    public user?: User | null,
    public namespace?: NamespaceWrapper,
    public room? :string,
    public skipNextMiddleware: boolean = false
  ) {

  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      type: this.type,
      text: this.text,
      user: this.user ? this.user.nick : undefined,
      room: this.room
    };
  }
}

export enum MessageType {
  MESSAGE = "message",
  NOTIFICATION = "notification",
  CONNECTION = "connection"
}

export function isValidMessagePayload(payload: any): boolean {
  return (payload.timestamp && payload.type);
}