import { Server, Socket } from "socket.io";
import { findUserByTwoParams } from "../database/db";
import PrivateIo from "../classes/PrivateIo";
import Encrypty from "./Encrypty";

export default async function login (io: Server, socket: Socket, data) { // {password, nameOrEmail, window, document, cookie}
    const user = await findUserByTwoParams(data.nameOrEmail, data.password);
    
    if (!user) return new PrivateIo(io).emit(socket.id, "authError", 1);
    new PrivateIo(io).emit(socket.id, "redirectAndCookie", {
        cookie: {key: "token", value: Encrypty.encode(user.token)},
        path: "chat"
    })
}