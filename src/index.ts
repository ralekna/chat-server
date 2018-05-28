import ChatServer from './server';

let chatServer = new ChatServer('127.0.0.1', 5000);
chatServer.init();