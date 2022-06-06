import { Server, Socket } from "socket.io";
import PrivateIo from "../classes/PrivateIo";
import { BackgroundImages } from "../config";
import { createMessage, deleteMessage, findLastMessages, findMessage, findUser, _randomToken } from "../database/db";
import { User } from "../database/models/User";
import checkUserNamesSymbols from "../modules/check-username";
import Cloudinary from "../modules/Cloudinary";
import createMessageHtml, { createEditableMessage } from "../modules/createMessageHtml";
import Encrypty from "../modules/Encrypty";
import { encodeHtml, decodeHtml } from "../modules/filterhtml";
import { Listener } from "../modules/Listener";
import login from "../modules/login";
import verificationEmail from "../modules/send-email";
import signup from "../modules/signup";
import splitSpaces from "../modules/splitSpaces";
import util from "dann-util";
import { Attachment, Message, MessageKeys } from "../database/models/Message";
import fs from "fs";
import { _DBHelpers } from "../modules/helpers"
import path from "path";
import GlobalClient from "../classes/GlobalClient";
import InterfaceManager from "../modules/InterfaceManager";
import Cooldown from "../classes/Cooldown";
import GlobalHolder from "../classes/GlobalHolder";

export default function socketHandler(io: Server, socket: Socket) {
    socket.on("disconnect", () => {
        GlobalHolder.remove("sockets", socket.id);
        getMembership(io)
    })
    socket.on("logout", () => {
        GlobalHolder.remove("sockets", socket.id);
        getMembership(io)
    })
    // main start
    io.emit('count', Object.keys(io.sockets.sockets).length);
    socket.on("messageGot", (data) => sendMessage(io, socket, data))
    socket.on("login", (data) => login(io, socket, data));
    socket.on("signup", (data) => signup(io, socket, data));
    socket.on("displayUserNameOnChat", async (data) => {
        const user = await findUserDecode(data);
        if (!user) return;
        GlobalHolder.add("sockets", socket.id, data, true);
        getMembership(io)
        new PrivateIo(io).emit(socket.id, "displayUserNameOnChat", user.username)
    })

    socket.on('checkEmail', async email => {
        const user = await findUser("email", email);
        new PrivateIo(io).emit(socket.id, "emailVerified", user)
    })
    socket.on("sendCode", (data) => {
        if (!Listener.code.has(data.temp)) verificationEmail(io, data, Listener);
    })
    socket.on("verifyCode", async data => {
        // console.log(Listener.code)
        if (!Listener.code.has(data.temp)) return new PrivateIo(io).emit(socket.id, "resetResult", 3);
        if (Listener.code.get(data.temp) != data.code) return new PrivateIo(io).emit(socket.id, "resetResult", 1);
        var token = _randomToken();
        while (await findUser("token", token)) token = _randomToken();
        await User.updateOne({ token: data.temp.slice(data.temp.length / 2) }, { $set: { password: Encrypty.encode(data.password), token } })
        new PrivateIo(io).emit(socket.id, "resetResult", 4)
    })
    // main end

    socket.on("userRequest", async (token) => {
        new PrivateIo(io).emit(socket.id, "userData", await findUserDecode(token, []));
    })

    socket.on("userRequestUsername", async username => {
        const data = {...(await findUser("username", username, ["email"]))};
        data.biography = data.biography ? splitSpaces(data.biography) : "";
        new PrivateIo(io).emit(socket.id, "userDataUsername", data)
    })

    socket.on("newAvatarUrl", async ({ url, token }) => {
        const user = await findUserDecode(token);
        if (user) {
            if (user.avatar) {
                // console.log(user.avatar)
                await (new Cloudinary()).delete(new String(user.avatar).split("/").at(-1).split(".")[0]);
            }
            await User.updateOne({ token: user.token }, { $set: { avatar: url } });
        }
    })

    socket.on("profileChanges", () => {
        new PrivateIo(io).emit(socket.id, "enableChanges", changes())
    })

    socket.on("tryUpdateLink", async (link) => {
        const url = await (new Cloudinary()).upload(link);
        new PrivateIo(io).emit(socket.id, "updateAvatarData", url)
    })

    socket.on("newUsernameAndBio", async ({ bio, username, token }) => {
        var code = 5;
        const userFoundWithThisUsername = await findUser("username", username);
        if (userFoundWithThisUsername) {
            if (userFoundWithThisUsername.token !== Encrypty.decode(token)) {
                code = 3;
            }
        } else {
            if (checkUserNamesSymbols(username) || username.split(" ").join("").length !== username.length) {
                code = 4;
            } else if (username.length < 3 || username.length > 30) {
                code = 6
            } else {
                await User.updateOne({ token: Encrypty.decode(token) }, { $set: { username } })
            }
        }
        console.log(bio)
        const b = splitSpaces(bio, true);
        if (b) {
            await User.updateOne({ token: Encrypty.decode(token) }, { $set: { biography: b } })
        }
        
        new PrivateIo(io).emit(socket.id, "updateCode", code)
    })

    socket.on("100msgRequest", async ({start, scroll}) => {
        if (!Cooldown.isPassed(socket.id)) return console.log("cooldown");
        Cooldown.add(socket.id, new Date(Date.now() + 1000));
        const messages = await findLastMessages(start, 10);
        if (!messages || messages.length === 0) return;
        const html_texts = (await Promise.all(messages.map(async msg => {
            const user = await findUser("id", msg.authorId);
            if (user) return createMessageHtml({premium: user.premium, displayColor: user.displayColor, date: msg.date, avatarUrl: user.avatar, username: user.username, message: splitSpaces((msg.content)), messageId: msg.id, attachments: msg.attachments});
        }))).reverse();
        new PrivateIo(io).emit(socket.id, "100msg", {start, scroll, html: html_texts.join("\n")})
    })

    socket.on('themeCode', code => {
        new PrivateIo(io).emit(socket.id, "bodyBackground", BackgroundImages[code]);
    })

    socket.on("messageDataRequest", async ({ messageId, token }) => {
        const user = await findUserDecode(token, []);
        if (!user) return;
        const message = await findMessage("id", messageId);
        if (!message) return;
        const author = await findUser("id", message.authorId, []);
        var html = [`<ul class="contextMenuList" id="${messageId}">`];
        if (message.content) html.push(li('<i class="fa-solid fa-copy"></i>', `(() => {navigator.clipboard.writeText(decodeHtml(\`${message.content}\`)).then(() => invalidCode(1, 2000))})`));
        if (user.id === message.authorId) {
            if (message.content) html.push(li('<i class="fa-solid fa-pen-to-square"></i>', `(() => {socket.emit(\`messageEditRequest\`, {token: \`${token}\`, messageId: \`${messageId}\`})})`));
            html.push(li('<i class="fa-solid fa-trash"></i>', `(() => {socket.emit(\`messageDeleteRequest\`, {token: \`${token}\`, messageId: \`${messageId}\`})})`));
        }
        html.push("</ul>");
        const clone = createEditableMessage({displayColor: author.displayColor, premium: author.premium, message: message.content || "", username: author.username, avatarUrl: author.avatar, attachments: message.attachments, date: message.date, messageId})
        new PrivateIo(io).emit(socket.id, "contextMenuHtml", {clone, ctx: html.join("\n")});
    })

    socket.on("messageDeleteRequest", async (data) => {
        const { token, messageId } = data;
        const user = await findUserDecode(token);
        if (!user) return;
        const message = await findMessage("id", messageId);
        if (!message) return;
        if (message.authorId !== user.id) return;
        deleteMessage(messageId).then(m => {
            GlobalClient.emit("messageDelete", m)
            io.emit("messageDeleted", m);
        })

    })

    socket.on("messageEditRequest", async ({token, messageId}) => {
        const user = await findUserDecode(token, []);
        if (!user) return;
        const message = await findMessage("id", messageId);
        if (!message) return;
        if (message.authorId !== user.id) return;
        new PrivateIo(io).emit(socket.id, "allowEditing", {message});
    })

    socket.on("profileParams", async (obj: { messageId: string, token: string }) => {
        const msg = await findMessage("id", obj.messageId);
        if (!msg) return;
        const author = await findUser("id", msg.authorId);
        var html = [`<ul class="profileMenuList" id="${author.id}">`];
        html.push(li("Посмотреть профиль", `( () => {window.location.href = window.location.origin + \`/profile/${author.username}\`} )`));
        html.push(li("Скопирать ссылку на профиль", `(() => {navigator.clipboard.writeText(window.location.origin + \`/profile/${author.username}\`).then(() => invalidCode(1, 2000))})`));
        if (author.avatar) html.push(a("Открыть аватарку", author.avatar, `${author.username}-avatar.png`));
        html.push(li("Скопировать ID", `(() => {navigator.clipboard.writeText('${author.id}').then(() => invalidCode(1, 2000))})`))
        html.push("</ul>");
        new PrivateIo(io).emit(socket.id, "profileParamsContextMenu", html.join("\n"))
    })

    socket.on("hitemRequest", () => {
        function g(content: string) {
            return `<div class="hitem">${content}</div>`
        }
        const list: string[] = hList().map(str => g(str));;
        io.emit("hitemList", list.join("\n"));
    })


    socket.on("newStatus", async ({token, status}) => {
        const user = await findUserDecode(token, []);
        if (!user) return;
        await User.updateOne({id: user.id}, {$set: {status}});
        new PrivateIo(io).emit(socket.id, "newStatusVerified", status);
    })
}


function changes() {
    return `<span class="profilepic__icon" ><i class="fas fa-camera"></i></span>
    <form method="POST" action="/profile-upload-avatar" id="avatarForm" enctype="multipart/form-data">
        <input name="profile-file" accept="image/x-png,image/jpeg,image/jpg" type="file"
            style="display: none;" id="uploadProfileImage">
    </form>
    <span class="profilepic__text">Новое Фото</span>`
}


function li(content: string, onclick?: string) {
    if (onclick) return `<p onclick="${onclick}()" class="messageDataItem">${content}</p>`;
    return `<p class="messageDataItem">${content}</p>`;
}

function a(content: string, href?: string, newBlank?: string) {
    var i = '';
    if (newBlank) {
        i = `target="_blank"`
    }
    if (href) return `<a class="profileMenuItem" href="${href}" ${i}>${content}</a>`;
    return `<a class="profileMenuItem" ${i}>${content}</a>`;
}

/**
 * Get user by encoded token
 * 
 * @param {string} token user's token utf8 encoded 
 * @param {Array<keyof User>} safe hide danger fields ( [] for hide all)
 */
export async function findUserDecode(token: string, safe?: (keyof User)[]) {
    return await findUser("token", Encrypty.decode(token), safe)
}

// Send the new message to everyone
async function sendMessage(io: Server, socket: Socket, data: { editing: string, userToken: string, message: string, files: Attachment[] }) { // {token: string, message: string}
    // console.log(data)
    var user = await findUserDecode(data.userToken);
    if (!user) {
        return;
    };

    if (data.editing) {
        const message = await findMessage("id", data.editing);
        if (!message || message.authorId !== user.id) return;
        if (!data.message || splitSpaces(data.message) === '') {
            await deleteMessage(data.editing);
            GlobalClient.emit("messageDelete", message)
            io.emit("messageDeleted", message);
            return;
        }
        await Message.updateOne({id: message.id}, {$set: {content: splitSpaces(encodeHtml(data.message), true)}})
        io.emit("messageEdited", {messageId: message.id, content: splitSpaces(data.message)})
    } else {
        const avatarUrl = user.avatar;
        const username = user.username;
        const message = util.shorten(data.message, 4096);
    
        const date = new Date();
        createMessage({ content: splitSpaces(encodeHtml(message), true), authorId: user.id, date, attachments: createAndGiveNames(data.files)}).then(async doc => {
            GlobalClient.emit("messageCreate", new InterfaceManager(MessageKeys).holdOnlyTheseKeys(doc));
            
            io.emit('message', createMessageHtml({premium: user.premium, displayColor: user.displayColor, date: doc.date, avatarUrl, username, message: splitSpaces(doc.content), messageId: doc.id, attachments: doc.attachments}));
            new PrivateIo(io).emit(socket.id, "privateScrollBottom", null);
        });
    }

};

function createAndGiveNames (files: Attachment[]): Attachment[] {
    files.forEach(file => {
        file.buffer = '';
    })
    return files;
}

function hList() {
    return [
        "Думал: я, навека",
        "Думал: я, навсегда",
        "Думал: я, мы с тобой неразлучные",
    ]
}

async function getMembership (io: Server) {
    const tokens: string[] = GlobalHolder.data.get("sockets").map(v => v);
        const users: User[] = []
        for (let token of tokens) {
            const user = await findUserDecode(token, []);
            if (!user) continue;
            user.biography = util.shorten(user.biography || "", 50)
            users.push(user);
        }

    io.emit("onlineMembersChange", util.shuffle(users));

}