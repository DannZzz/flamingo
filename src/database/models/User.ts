import { Schema, model } from "mongoose";

export interface User {
    /**
     * User's unique id
     */
    id?: string,
    /**
     * User's unique username
     */
    username?: string,
    /**
     * User's display color!
     */
    displayColor?: string,
    /**
     * Encoded password (Encrypty)
     */
    password?: string,
    /**
     * User's unique email
     */
    email?: string,
    /**
     * token
     */
    token?: string,
    /**
     * Discord oauth
     */
    discordAuth?: string,
    /**
     * User's unique discord id
     */
    discordId?: string,
    /**
     * Cloudinary avatar link
     */
    avatar?: string,
    /**
     * User's bio max Length 250
     */
    biography?: string,
    /**
     * User's premium's date
     */
    premium?: Date,
    /**
     * User's status
     */
    status?: string,
    /**
     * User's gender
     * todo: Make this with authorization
     */
    gender?: "male" | "female" | "hidden",
    /**
     * User's points (xp)
     */
    points?: number,
}

export const User = model("user", new Schema<User>({
    id: { type: String, unique: true, },
    premium: { type: Date, default: null },
    username: { type: String, unique: true, required: true },
    password: { type: String },
    status: { type: String, default: null },
    gender: { type: String },
    points: { type: Number, default: 0 },
    email: { type: String, default: null },
    displayColor: { type: String, default: null },
    biography: { type: String, default: null },
    token: { type: String, required: true},
    discordAuth: { type: String, default: null },
    discordId: { type: String, default: null },
    avatar: { type: String, default: "https://i.ibb.co/M112F3K/default.jpg" },
}))

export const UserKeys: ReadonlyArray<keyof User> = ["points", "gender", "status", "premium", "displayColor", "avatar", "biography", "discordAuth", "discordId", "email", "id", "password", "token", "username"];
export const UserDangerKeys: ReadonlyArray<keyof User> = ["premium", "discordAuth", "token", "password", "email"]