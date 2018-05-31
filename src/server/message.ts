import User from "./users/user";

export default class Message {
  constructor(
    public text: string,
    public room: string | string[],
    public user?: User | null,
    public timestamp: Date = new Date(),
    public type: MessageType.MESSAGE | MessageType.CONNECTION | MessageType.NOTIFICATION | MessageType.DISCONNECT | MessageType.JOIN = MessageType.MESSAGE,
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
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  JOIN = "join"
}

export function isValidMessagePayload(payload: any): boolean {
  return payload && payload.text && payload.text.length;
}

export function convertPayloadToMessage(payload: any): Message {
  return new Message(payload.text, payload.room || '', payload.timestamp || new Date(), payload.type || MessageType.MESSAGE);
}


export const MESSAGE_FORMAT = `{type?: string, text: string, room?: string, timestamp?: Date}`;