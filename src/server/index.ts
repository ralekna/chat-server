import SocketIO from 'socket.io';

export default class ChatServer {
    constructor(private host: string, private port: number) {

    }

    public init(): void {
        let io: SocketIO.Server = SocketIO(5000);

        io.on('connection', (socket) => {

            socket.broadcast.emit('user connected', { message: 'user connected', details: socket.id });
            socket.emit('message', { message: 'welcome to chat', details: socket.id });

            console.log('user connect', socket.id);
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