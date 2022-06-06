import Chest from "./Chest";

const _holder = new Chest<string, Chest<any, any>>()

export default class GlobalHolder {

    constructor(
        readonly name: string,
    ) {
    }

    remove() {
        _holder.delete(this.name);
    }

    add(...data: {key: string, value: any}[]) {
        const chest = new Chest();
        if (data.length > 0) {
            data.forEach(({key, value}) => {
                chest.set(key, value);
            })
        } 
        _holder.set(this.name, chest);
    }

    static get data () {
        return _holder
    }

    static add (groupName: string, key: string, value: any, noDuplicates?: boolean) {
        if (!this.data.has(groupName)) return;
        if (noDuplicates) {
            if (this.data.get(groupName).find(data => data === value)) return;
        }
        this.data.get(groupName).set(key, value);
    }

    

    static remove(groupName: string, key: string) {
        if (!this.data.has(groupName)) return;
        this.data.get(groupName).delete(key);
    }

    static get(groupName: string, key: string) {
        if (!this.data.has(groupName)) return;
        return this.data.get(groupName).get(key);
    }

    static has(groupName: string, key: string) {
        if (!this.data.has(groupName)) return;
        return this.data.get(groupName).has(key);
    }
}