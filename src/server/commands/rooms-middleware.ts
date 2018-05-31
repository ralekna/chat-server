import Middleware, {executeTextCommand} from "./middleware";
import {Socket} from "socket.io";
import Message, {MessageType} from "../message";
import Room from "../rooms/room";
import {Inject, Injectable} from "container-ioc";
import {UserRepository} from "../users/users-repository";
import SERVER_BOT_USER from "../users/server-bot-user";

@Injectable()
export default class RoomsMiddleware extends Middleware {

  constructor(@Inject(UserRepository) private userRepository: UserRepository) {
    super();
  }

  onMessage(socket: Socket, message: Message): Message | false {

    return executeTextCommand(message, {
      join: (message, ...args) => {
        let roomName = args[0];
        let roomPassword = args[1] || '';
        if (!roomName) {
          let errorMessage = new Message(`Can't join - room name not provided`, message.room, SERVER_BOT_USER);
          socket.emit(MessageType.NOTIFICATION, errorMessage);
          return false;
        }
        let room = this.namespaceWrapper.rooms.find(room => room.name === roomName);
        if (room) {
          if (room.password && room.password !== roomPassword) {
            let errorMessage = new Message(`Can't join - provided password is wrong`, message.room, SERVER_BOT_USER);
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
          let joinNotification = new Message(`You joined room [${roomName}]`, roomName, SERVER_BOT_USER);
          socket.emit(MessageType.JOIN, joinNotification);
        });
        return false;
      },
      count: (message, ...args) => {
        let roomName = args[0];
        let numberOfUsers = this.userRepository.getUsersByRoom(roomName).length;
        let countNotification = new Message(`This room has ${numberOfUsers} users.`, message.room, SERVER_BOT_USER);
        socket.emit(MessageType.NOTIFICATION, countNotification);
        return false;
      }
    });
  }

}