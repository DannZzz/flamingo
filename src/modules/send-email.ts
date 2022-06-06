import gmail from "gmail-send";
import { GMAIL_NAME, GMAIL_PASS } from "../config"
import Util from "dann-util";
import { Server } from "socket.io";
import { Listener } from "./Listener";
const { random } = Util;

export default async function verificationEmail (io: Server, data, Listener: Listener) {
    const send = gmail({
        from: GMAIL_NAME,
        user: GMAIL_NAME,
        pass: GMAIL_PASS,
        to: data.email,
    })

    const verifCode = random(100000, 999999);
    Listener.code.set(data.token+data.token, verifCode);
    setTimeout(() => {Listener.code.delete(data.token+data.token)}, 60 * 1000 * 60)
    send({
        subject: "Изменение пароля",
        html: `Код проверки: <b>${verifCode}</b> <br><br> Если не вы попросили код, то не обращайте внимание на этот сообщение, а если это повторяется нередко, обращайтесь к нам — <b>${GMAIL_NAME}</b>`
    }).then(a => console.log(a));

   
}