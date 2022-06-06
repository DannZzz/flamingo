import { Message } from "../database/models/Message";
import Chest from "./Chest";

export interface ClientOptions {
    token: string;
}

export const _ThisClients: Client[] = [] 

export interface Events {
    messageDelete: Message;
    messageCreate: Message;
}

type EventCallback<T> = (arg0: T) => void

export class Client {
    readonly _RunningEvents = new Chest<keyof Events, any[]>();

    readonly token: string;
    constructor (options: ClientOptions) {
        this.token = options.token;
        _ThisClients.push(this);
    }

    on<E extends keyof Events, F extends Events[E]>(event: E, callback: EventCallback<F>): void {
        const thisEv = this._RunningEvents.get(event);
        if (thisEv) {
            this._RunningEvents.set(event, [...thisEv, callback]);
        } else {
            this._RunningEvents.set(event, [callback]);
        }
    }
}

