import SocketIO, {Namespace, Server} from 'socket.io';
import Express from 'express';
import Http from 'http';
import Middleware from "./commands/middleware";
import Room from "./rooms/room";
import NamespaceWrapper from "./namespaces/namespace";

export default class ChatServer {

  public socketServer!: Server;

  constructor(
    private port: number,
    private namespaces: NamespaceWrapper[]) {
  }

  public init(): void {

    let app = Express();

    let server = Http.createServer(app);

    this.socketServer = SocketIO(server);

    if (this.socketServer) {
      this.namespaces.forEach(namespaceWrapper => {
        namespaceWrapper.setServer(this, this.socketServer);
      })
    }

    let chat: Namespace = socketServer.on('connection', (socket) => {
      socket.broadcast.emit('message', {message: 'user connected', details: socket.id});
      socket.emit('message', {message: 'welcome to chat', details: socket.id});

      socket.on('message', (message) => {
        socket.broadcast.emit('message', {message, details: socket.id});
      })

      console.log('user connect', socket.id);
    });
    setInterval(() => chat.emit('message', {message: Math.random()}), 5000)
    

    server.listen(this.port, () => {
      console.log(`listening on *:${this.port}`);
    });

    let chat2: Namespace = socketServer
        .of('/public')
        .on('connection', (socket: SocketIO.Socket) => {
            socket.emit('a message', {
                that: 'only'
                , '/chat': 'will get'
            });
            chat.emit('a message', {
                everyone: 'in'
                , '/chat': 'will get'
            });
        });

    let news = socketServer
        .of('/news')
        .on('connection', (socket: SocketIO.Socket) => {
            socket.emit('item', { news: 'item' });
        });
    console.log('starting server');
  }
}