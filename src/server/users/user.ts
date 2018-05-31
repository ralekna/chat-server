import {Socket} from "socket.io";

export default class User {
  constructor(
    public socket: Socket | {id: string; rooms: {[id: string]: Socket}}, // this typedef is a hack
    public nick: string = `guest${Date.now()}`
  ) {}
}