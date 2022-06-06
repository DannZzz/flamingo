import express from 'express';
import path from "path";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { PORT } from './config';
// mongodb connection
import connection from './database/connection';
import discordOauthFunction from './routers/discordOauthFunction';
import socketHandler from './handlers/socketHandler';
import profileRouter from './routers/profile';
connection()
import multer from "multer";
import { Client } from './classes/Client';
import GlobalHolder from './classes/GlobalHolder';
import { findUser } from './database/db';
new GlobalHolder("sockets").add();


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload/chat')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var chatStorage = multer({ storage: storage })
// const chatStorage = multer({dest: "./upload/chat"}).array("image");

var urlencodedParser = bodyParser.urlencoded({ extended: false })  


const paths = {
    chat: path.resolve("./public/chat"),
    auth: path.resolve("./public/auth"),
    reset: path.resolve("./public/get-code"),
    enterMail: path.resolve("./public/enter-email"),
    profile: path.resolve("./public/profile"),
    messageImages: path.resolve("./upload/chat")
}

const app = express();


app.get("/", (req, res) => {
    res.redirect(301, "/chat")
})

app.use(bodyParser.json());

app.use("/enter-email", express.static(paths.enterMail))

app.use("/get-code", express.static(paths.reset))

app.use("/chat", express.static(paths.chat))

app.use("/auth", express.static(paths.auth))
app.get("/auth/discord", urlencodedParser, discordOauthFunction)

app.use("/profile", profileRouter);

app.use("/message/image", express.static(paths.messageImages));

app.get("/api/user", async (req, res) => {
    const id = req.query.id;
    if (id) {
        res.json(await findUser("id", id as string, []));
    }
})

app.post("/chat/image", chatStorage.array("image", 10), (req, res) => {
    for(var i=0;i<req.files.length;i++){
        console.log(req.files[i].path);
    }
})

const server = http.createServer(app);
const io = new Server(server, {"allowEIO3": true});

io.on("connection", (socket) => socketHandler(io, socket));

server.listen(PORT, () => {
    console.log("Server is listening to http://localhost:" + PORT)
})
