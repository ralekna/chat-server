import Middleware, {executeTextCommand} from "./middleware";
import {Socket} from "socket.io";
import Message, {MessageType} from "../message";
import SERVER_BOT_USER from "../users/server-bot-user";

const COMMANDS_HELP =
`
/help - display this message
/nick newNickname - change your nickname to a new one
/join roomName [password] - join or create room. Provide password if you want to access private room or create such.
/count - get number of users in room
/rooms - get a list of public rooms
`;

export default class HelpMiddleware extends Middleware {

  onConnect(socket: Socket, message?: Message): Message | false {
    let notification = new Message(`Type /help to get a list of commands.`, socket.id, SERVER_BOT_USER);
    socket.emit(MessageType.NOTIFICATION, notification);
    return notification;
  }

  onMessage(socket: Socket, message: Message): Message | false {

    return executeTextCommand(message, {
      help: (message, ...args) => {

        let notification = new Message(COMMANDS_HELP, socket.id, SERVER_BOT_USER);
        socket.emit(MessageType.NOTIFICATION, notification);
        return notification;
      }
    });
  }
}