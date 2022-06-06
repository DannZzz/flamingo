import Chest from "./Chest";

export default class Cooldown {
    private static readonly _cds = new Chest<string, Date>();

    static get all () {
        return this._cds;
    }

    static add (key: string, time: Date) {
        this._cds.set(key, time);
    }

    static get (key: string) {
        return this._cds.get(key);
    }

    static isPassed (key: string) {
        if (!this.get(key)) return true;
        if (this.get(key) < new Date()) return true;
        return false;
    }

    static remove (...key: string[]) {
        this._cds.deleteMany((v, k) => key.includes(k));
    }
}