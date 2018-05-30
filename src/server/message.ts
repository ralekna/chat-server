import User from "./users/user";

export default class Message {
  constructor(
    public type: MessageType.MESSAGE | MessageType.CONNECTION | MessageType.NOTIFICATION | MessageType.DISCONNECT,
    public text: string ,
    public room: string,
    public user?: User | null,
    public timestamp: Date = new Date()
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
  DISCONNECT = "disconnect"
}

export function isValidMessagePayload(payload: any): boolean {
  return payload.text && payload.text.length;
}

export function convertPayloadToMessage(payload: any): Message {
  return new Message(payload.type || MessageType.MESSAGE, payload.text, payload.room || '');
}


export const MESSAGE_FORMAT = `{type?: string, text: string, room?: string, timestamp?: Date}`;