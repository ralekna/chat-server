import { Socket } from "socket.io";

type Command = (socket: Socket, ...args: string[]) => void;
export default Command;