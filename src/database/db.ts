import Encrypty from "../modules/Encrypty";
import Util from "dann-util";
import { User, UserDangerKeys, UserKeys } from "./models/User";
import { Message } from "./models/Message";
import fs from "fs";
import path from "path";
import { keys } from 'ts-transformer-keys';
import InterfaceManager from "../modules/InterfaceManager"


/**
 * Find a model of user
 * 
 * @param {K} field search field
 * @param {User[K]} value id or something else
 * @returns model of user
 */
export async function findUser<K extends keyof User, V extends User[K]>(field: K, value: V): Promise<User>;
/**
 * Find a model of user
 * 
 * @param {K} field search field
 * @param {User[K]} value id or something else
 * @param {Array<keyof User>} safe hide danger fields ( [] for hide all)
 * @returns model of user
 */
export async function findUser<K extends keyof User, V extends User[K]>(field: K, value: V, safe: (keyof User)[]): Promise<User>;
/**
 * Find a model of user
 * 
 * @param {K} field search field
 * @param {User[K]} value id or something else
 * @param {Array<keyof User>} safe hide danger fields ( [] for hide all)
 * @returns model of user
 */
export async function findUser<K extends keyof User, V extends User[K]>(field: K, value: V, safe?: (keyof User)[]): Promise<User> {
    var data: any = await User.findOne({ [field]: value });

    data = new InterfaceManager(UserKeys).holdOnlyTheseKeys(data);
    var empty = {};
    if (Array.isArray(safe)) {
        if (safe.length === 0) {
            for (let key in data) {
                if (!UserDangerKeys.includes(key as keyof User)) empty[key] = data[key];
            }
        } else {
            for (let key in data) {
                if (UserDangerKeys.includes(key as keyof User)) {
                    if (safe.includes(key as keyof User)) empty[key] = data[key];
                } else {
                    empty[key] = data[key];
                }
            }
        }
    } else {
        empty = { ...data }
    }
    return empty;
}

/**
 * Find a model of user by 2 params
 * 
 * @param {string} nameOrEmail username or email
 * @param {string} password password
 * @returns model of user
 */
export async function findUserByTwoParams(nameOrEmail: string, password: string): Promise<User> {
    const data = await User.findOne({ username: nameOrEmail, password: Encrypty.encode(password) });
    if (!data) return await User.findOne({ email: nameOrEmail, password: Encrypty.encode(password) });
    return data;
}

/**
 * Create user's document
 * 
 * @param {} data 
 * @example
 *  {
 *      email: string,
 *      username: string,
 *      password: string    
 *  }
 */
export async function createUser<R extends Pick<User, Exclude<keyof User, "token" | "id">>>(data: R) {
    function generateId() {
        return Util.random(1_000_000_000_000, 9_999_999_999_999) + "";
    }
    var id = generateId();
    while (await findUser("id", id)) id = generateId();
    var token = _randomToken();
    while (await findUser("token", token)) token = _randomToken();

    const d = await User.create({ ...data, id, token });
    d.save();
    return d;
}


/**
 * Find message by props
 * 
 * @param {string} field Message model field
 * @param value the value
 * @returns {Message}
 */
export async function findMessage<F extends keyof Message>(field: F, value: Message[F]): Promise<Message>;
/**
 * Find message by props
 * 
 * @param {string} field Message model field
 * @param value the value
 * @param {boolean} many find()
 * @returns {Message}
 */
export async function findMessage<F extends keyof Message>(field: F, value: Message[F], many: boolean): Promise<Message[]>;
/**
 * Find message by props
 * 
 * @param {string} field Message model field
 * @param value the value
 * @param {boolean} many find()
 * @returns {Message}
 */
export async function findMessage<F extends keyof Message>(field: F, value: Message[F], many?: boolean): Promise<Message | Message[]> {
    if (many) {
        return await Message.find({ [field]: value });
    } else return await Message.findOne({ [field]: value });
}

/**
 * Find Last message to load
 * @returns {Message[]}
 */
export async function findLastMessages(): Promise<ReadonlyArray<Message>>;
/**
 * Find Last message to load at up of spec. message
 * @param {string} start message Id
 * @returns {Message[]}
 */
export async function findLastMessages(start: string): Promise<ReadonlyArray<Message>>;
/**
 * Find Last message to load at up of spec. message
 * @param {string} start message Id
 * @param {number} limit limit of gotten messages 
 * @returns {Message[]}
 */
export async function findLastMessages(start: string, limit: number): Promise<ReadonlyArray<Message>>;
/**
 * Find Last message to load at up of spec. message
 * @param {string} start message Id
 * @param {number} limit limit of gotten messages 
 * @returns {Message[]}
 */
export async function findLastMessages(start?: string, limit: number = 100): Promise<ReadonlyArray<Message>> {
    var data: Message[];
    if (!start) {
        data = await Message.find().sort({ date: -1 }).limit(limit);
    } else {
        const msg = await findMessage("id", start);
        if (!msg) {
            data = await Message.find({ id: { $nin: [start] } }).sort({ date: -1 }).limit(limit);
        } else {
            data = await Message.find({ $and: [{ date: { $lte: msg.date } }, { id: { $nin: [start] } }] }).sort({ date: -1 }).limit(limit);
        }
    }
    return data;
}

/**
 * Add ne message to database
 * 
 * @param {Pick<Message, Exclude<keyof Message, "id">>} data new message data
 * @returns {Message}
 */
export async function createMessage(data: Pick<Message, Exclude<keyof Message, "id">>): Promise<Message> {
    function generateId() {
        return Util.random(1_000_000_000_000, 9_999_999_999_999);
    };
    var id: number = generateId();
    while (await findMessage("id", id + "")) id = generateId();

    const doc = await Message.create({ ...data, id, attachments: data.attachments });
    await doc.save();
    return doc;
}

/**
 * Delete message by id from database
 * 
 * @param {string} id message id
 * @returns {Message} deleted message
 */
export async function deleteMessage(id: string): Promise<Message>;
/**
 * Delete message by id from database
 * 
 * @param {string} id message id
 * @param {boolean} admin was the message deleted by admin
 * @returns {Message} deleted message
 * 
 */
export async function deleteMessage(id: string, admin: boolean): Promise<Message>;
/**
 * Delete message by id from database
 * 
 * @param {string} id message id
 * @param {boolean} admin was the message deleted by admin
 * @returns {Message} deleted message
 * 
 */
export async function deleteMessage(id: string, admin?: boolean): Promise<Message> {
    const message = await findMessage("id", id);
    try {
        if (message.attachments && message.attachments.length > 0) {
            message.attachments.forEach(file => fs.unlinkSync(path.resolve("./upload/chat/" + file.name)))
        }
        await Message.deleteOne({ id });
        return message;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

export async function matchPoints (id: string, has: number): Promise<boolean>; 
export async function matchPoints (points: number, type: "more" | "less"): Promise<User[]>;
export async function matchPoints (sort: boolean, limit: number): Promise<User[]>;
export async function matchPoints (arg1: string | number | boolean, arg2: number | "more" | "less"): Promise<boolean | User[]> {
    if (typeof arg1 === "string") {
        const user = await findUser("id", arg1);
        if (!user) return undefined;
        if (user.points >= arg2) {
            return true;
        } else return false;
    } else if (typeof arg1 === "number" || typeof arg1 === "bigint") {
        const data = await User.find({points: {$exists: true}}).sort({points: -1});
        return data.filter(user => arg2 === "more" ? user.points > arg1 : user.points < arg1);
    } else if (typeof arg1 === "boolean") {
        return await User.find({points: {$exists: true}}).sort({points: -1}).limit(arg2 as number);
    }
}


// creates random token with 100 length
export function _randomToken(): string {
    var code = '';
    var symbols = "abcdefghijklmnopqrstuvwxyz0123456789._-*+/#&^%$@!"
    for (let i = 0; i < 100; i++) {
        const symb = symbols[Math.floor(Math.random() * symbols.length)];
        code += i % 2 === 0 ? symb.toUpperCase() : symb
    }
    return code;
}