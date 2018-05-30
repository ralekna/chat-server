import {Socket} from "socket.io";

export default class User {
  constructor(
    public socket: Socket,
    public nick: string = `guest${Date.now()}`
  ) {}
}