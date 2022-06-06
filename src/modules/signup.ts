import { createUser, findUser } from "../database/db";
import checkUserNamesSymbols from "./check-username";
import { Server, Socket } from "socket.io";
import PrivateIo from "../classes/PrivateIo";
import Encrypty from "./Encrypty";

export default async function signup (io: Server, socket: Socket, data) { // {password, username, email, window, document, cookie}
    const isEmail = await findUser("email", data.email);
    if (isEmail) return new PrivateIo(io).emit(socket.id, "authError", 3);
    if (checkUserNamesSymbols(data.username)) return new PrivateIo(io).emit(socket.id, "authError", 4)
    const isUsername = await findUser("username", data.username);
    if (isUsername) return new PrivateIo(io).emit(socket.id, "authError", 2);
    
    const user = await createUser({
        email: data.email,
        username: data.username,
        password: Encrypty.encode(data.password)
    })
    new PrivateIo(io).emit(socket.id, "redirectAndCookie", {
        cookie: {key: "token", value: Encrypty.encode(user.token)},
        path: "chat"
    })
}