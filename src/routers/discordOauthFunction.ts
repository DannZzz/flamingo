import { Request, Response } from "express";
import discordOauth from "discord-oauth2";
import { client_id, client_secret, PORT } from "../config";
import { findUser, createUser } from "../database/db";
import Encrypty from "../modules/Encrypty";
import removeUsernameChars from "../modules/remove-chars";
import util from "dann-util"
import { User } from "../database/models/User";

const DiscordOauth = new discordOauth()

export default async function discordOauthFunction (req: Request, res: Response) {
    const { code } = req.query;
    console.log("code: " + code)

    // console.log(io)
    if (code) {
        try {
            

            const oauthResult = await DiscordOauth.tokenRequest({
                clientId: client_id,
                clientSecret: client_secret,
                code: code as any,
                grantType: 'authorization_code',
                redirectUri: `http://localhost:${PORT}/auth/discord`,
                scope: 'identify email',
            })

            // console.log(oauthResult);

            const user = await DiscordOauth.getUser(oauthResult.access_token);
            console.log(user)
            const userInBase = await findUser("discordId", user.id)

            var data = {
                ...userInBase
            }
            if (!userInBase) {
                var validUsername = removeUsernameChars(user.username);
                if (!validUsername) {
                    validUsername = "user_" + util.random(1, 100000);
                }
                while (await findUser("username", validUsername)) validUsername = "user_" + util.random(1, 100000);
                data.username = validUsername;
                await createUser({ discordAuth: Encrypty.encode(oauthResult.access_token), username: validUsername, discordId: user.id });
            } else if (userInBase.discordAuth !== Encrypty.encode(oauthResult.access_token)) {
                await User.updateOne({discordId: user.id}, {$set: {discordAuth: Encrypty.encode(oauthResult.access_token)} })
            }
            res.redirect(`/auth?token=${Encrypty.encode((await findUser("discordId", user.id)).token)}`);
        } catch (error) {
            res.redirect(`/auth`)
            // NOTE: An unauthorized token will not throw an error;
            // it will return a 401 Unauthorized response in the try block above
            console.error(error);
        }
       
    }
}