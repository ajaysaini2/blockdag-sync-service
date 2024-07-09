import { Socket } from "socket.io-client";

type GlobalWithSocket = {
    socket: Socket;
};

declare const global: GlobalWithSocket;
class SocketEventEmitter {
    emitMessage<T>(eventName: string, data: any) {
        const globalVar: GlobalWithSocket = global;
        globalVar.socket.emit(eventName, data);
    }
}

export default new SocketEventEmitter();