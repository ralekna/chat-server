import ChatServer from './server';
import NamespaceWrapper from "./server/namespaces/namespace";
import ChatMiddleware from "./server/commands/chat-middleware";
import {Container} from 'container-ioc';
import {UserRepository} from "./server/users/users-repository";
import UserMiddleware from "./server/commands/user-middleware";
import Room from "./server/rooms/room";
import NumberGenerationMiddleware from "./server/commands/number-generation-middleware";
import RoomsMiddleware from "./server/commands/rooms-middleware";

// initialize dependencies
const container = new Container();
container.register([
  {token: UserRepository, useClass: UserRepository},
  {token: UserMiddleware, useClass: UserMiddleware}
]);

let chatServer = new ChatServer(5000, [
  new NamespaceWrapper('/', [
    container.resolve(UserMiddleware),
    new RoomsMiddleware(),
    new ChatMiddleware()
  ], [
    new Room('numbers', '', [
      new NumberGenerationMiddleware()
    ]),
    new Room('secret', 'edgeless', [])

  ])
]);
chatServer.init();