export default class InterfaceManager<T extends number | string | symbol> {
    constructor (readonly keys: Array<T> | ReadonlyArray<T>) {

    }

    holdOnlyTheseKeys(obj: {[k: string]: any}): {[k in T]: any} {
        const clone = {} as any;
        for (let key in obj) {
            if (this.keys.includes(key as any)) clone[key] = obj[key];
        }

        return clone;
    }
}