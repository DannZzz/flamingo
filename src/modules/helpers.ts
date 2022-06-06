import { writeFile, existsSync } from "fs";
import { promisify } from "util";

const writeFilePromise = promisify(writeFile);

export class _DBHelpers {
    static throw(message: string, get: boolean = false) {
        const err = new Error();
        err.name = "DataBaseError";
        err.message = message;
        if (get) return err;
        throw err;
    }

    static randomId (ids?: string[], length: number = 12) {
        const all = "abcdefghijklmnopqrstuvwxyz0123456789#@_-.,*&^%$"
        function generate () {
            let code = "";
            for (let i = 0; i < length; i++) {
                code += all[Math.floor(Math.random() * all.length)];
            }
            return code;
        }
        let id = generate();
        while (ids.includes(id)) {
            id = generate();
        }
        return id;
    }

    static async getOrCreateFile(path: string) {
        if (existsSync(path)) {
            return require(path);
        } else {
            await writeFilePromise(path, JSON.stringify([], null, 2))
            return require(path);
        }
    }

    static async writeFile(path: string, data: any) {
        await writeFilePromise(path, JSON.stringify(data, null, 2));
    }
}
