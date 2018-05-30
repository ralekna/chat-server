import Middleware, {executeTextCommand} from "./middleware";
import {Socket} from "socket.io";
import Message, {MessageType} from "../message";
import Room from "../rooms/room";

export default class RoomsMiddleware extends Middleware {

  onMessage(socket: Socket, message: Message): Message | false {

    return executeTextCommand(message, {
      join: (message, ...args) => {
        let roomName = args[0];
        let roomPassword = args[1] || '';
        if (!roomName) {
          let errorMessage = new Message(`Can't join - room name not provided`, message.room);
          socket.emit(MessageType.NOTIFICATION, errorMessage);
          return false;
        }
        let room = this.namespaceWrapper.rooms.find(room => room.name === roomName);
        if (room) {
          if (room.password && room.password !== roomPassword) {
            let errorMessage = new Message(`Can't join - provided password is wrong`, message.room);
            socket.emit(MessageType.NOTIFICATION, errorMessage);
            return false;
          }
        } else {
          let newRoom = new Room(roomName, roomPassword);
          newRoom.setNamespace(this.namespace);
          newRoom.setServer(this.server);

          this.namespaceWrapper.rooms.push(newRoom);
        }

        socket.join(roomName, () => {
          let joinNotification = new Message(`You joined room [${roomName}]`, message.room);
          socket.emit(MessageType.JOIN, joinNotification);
        });
        return false;

      }
    });
  }

}