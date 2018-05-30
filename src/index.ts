import ChatServer from './server';
import NamespaceWrapper from "./server/namespaces/namespace";
import ChatMiddleware from "./server/commands/chat-middleware";

let chatServer = new ChatServer(5000, [
  new NamespaceWrapper('/', [], [], [], [])
]);
chatServer.init();