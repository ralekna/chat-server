import {Server, Socket} from "socket.io";
import Middleware, {executeTextCommand} from "./middleware";
import Message, {MessageType} from "../message";
import User from "../users/user";
import {Inject} from "container-ioc";
import {IUserRepository, TUserRepository} from "../users/users-repository";

export default class UserMiddleware extends Middleware {

  constructor(@Inject(TUserRepository) private userRepository: IUserRepository) {
    super();
  }

  onConnect(socket: Socket, message?: Message): Message | false {
    let user = new User(socket);

    this.userRepository.add(user);
    let greetingMessage = new Message(`Welcome to Edgeless server! \nYour nickname is "${user.nick}".`, socket.id, user);
    socket.emit(MessageType.NOTIFICATION, greetingMessage);
    return greetingMessage;
  }

  onDisconnect(socket: Socket, message?: Message): Message | false {
    let user = this.userRepository.getUserBySocketId(socket.id);
    this.userRepository.remove(user);

    let disconnectMessage = new Message(`User [${user.nick}] has left the server`, '', user);
    this.server.emit(MessageType.NOTIFICATION, disconnectMessage);
    return disconnectMessage;
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