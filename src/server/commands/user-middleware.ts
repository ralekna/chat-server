import {Socket} from "socket.io";
import Middleware, {executeTextCommand} from "./middleware";
import Message, {MessageType} from "../message";
import User from "../users/user";
import {Inject} from "container-ioc";
import {UserRepository} from "../users/users-repository";

export default class UserMiddleware extends Middleware {

  constructor(@Inject(UserRepository) private userRepository: UserRepository) {
    super();
  }

  onConnect(socket: Socket, message?: Message): Message | false {
    let user = new User(socket);

    this.userRepository.add(user);
    let greetingMessage = new Message(`Welcome to Edgeless server! \nYour nickname is "${user.nick}".`, socket.id, user);
    socket.emit(MessageType.JOIN, greetingMessage);
    return greetingMessage;
  }

  onDisconnect(socket: Socket, message?: Message): Message | false {
    let user = this.userRepository.getUserBySocketId(socket.id);
    this.userRepository.remove(user);

    let roomsNS;
    if (message && message.room) {
      if (Array.isArray(message.room)) {
        roomsNS = this.namespace;
        for (let room of message.room) {
          roomsNS = roomsNS.to(room);
        }
      } else {
        roomsNS = this.namespace.to(message.room);
      }
      let disconnectMessage = new Message(`User [${user.nick}] has left the server`, '', user);
      roomsNS.emit(MessageType.NOTIFICATION, disconnectMessage);
      return disconnectMessage;
    }

    return false;
  }

  onMessage(socket: Socket, message: Message): Message | false {

    if (!message.user) {
      message.user = this.userRepository.getUserBySocketId(socket.id);
    }

    return executeTextCommand(message, {
      nick: (message, ...args) => {
        let newNick = args[0];
        if (!newNick) {
          let errorMessage = new Message(`Error: argument for new nickname wasn't provided`, socket.id);
          socket.emit(MessageType.NOTIFICATION, errorMessage);
          return false;
        } else {
          let userWithSpecifiedNick = this.userRepository.getUserByNickname(newNick);
          if (userWithSpecifiedNick) {
            if (userWithSpecifiedNick.socket !== socket) {
              let errorMessage = new Message(`Error: this nickname is already taken by someone else`, socket.id);
              socket.emit(MessageType.NOTIFICATION, errorMessage);
              return false;
            } else {
              let notification = new Message(`Congratulations, you became yourself!`, socket.id);
              socket.emit(MessageType.NOTIFICATION, notification);
              return false;

            }
          } else {
            message.user!.nick = newNick;
            let notification = new Message(`Your nickname now is [${newNick}]`, socket.id);
            socket.emit(MessageType.NOTIFICATION, notification);
            return false;
          }
        }
      }
    });

  }


}