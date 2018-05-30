import SocketIO, { Namespace } from 'socket.io';
import Express from 'express';
import Http from 'http';

export default class ChatServer {
  constructor(private host: string, private port: number) {
  }

  public init(): void {

    let app = Express();

    let server = Http.createServer(app);

    let io: SocketIO.Server = SocketIO(server);

    let chat: Namespace = io.on('connection', (socket) => {
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

    // let chat = io
    //     .of('/chat')
    //     .on('connection', (socket: SocketIO.Socket) => {
    //         socket.emit('a message', {
    //             that: 'only'
    //             , '/chat': 'will get'
    //         });
    //         chat.emit('a message', {
    //             everyone: 'in'
    //             , '/chat': 'will get'
    //         });
    //     });
    //
    // let news = io
    //     .of('/news')
    //     .on('connection', (socket: SocketIO.Socket) => {
    //         socket.emit('item', { news: 'item' });
    //     });
    console.log('starting server');
  }
}