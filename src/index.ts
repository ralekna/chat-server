import ChatServer from './server';
import NamespaceWrapper from "./server/namespaces/namespace";
import ChatMiddleware from "./server/commands/chat-middleware";
import {Container} from 'container-ioc';
import {TUserRepository, UserRepository} from "./server/users/users-repository";

// initialize dependencies
(new Container()).register([
  {token: TUserRepository, useClass: UserRepository}
]);

let chatServer = new ChatServer(5000, [
  new NamespaceWrapper('/', [], [], [], [])
]);
chatServer.init();