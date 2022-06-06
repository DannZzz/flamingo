import socket, { Server } from "socket.io"

export default class PrivateIo {
    /**
     * @param {socket} io Server
     */
    constructor (readonly io: Server) {
    }
    
    /**
     * Emit to a single socket
     * 
     * @param {string} socketId socket's id
     * @param {string} key emit's key (name)
     * @param {any} value value to emit
     */
    emit(socketId: string, key: string, value: any) {
        if (socketId && key) this.io.to(socketId).emit(key, value);
    }
}