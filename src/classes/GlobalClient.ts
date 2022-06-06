import { Events, _ThisClients } from "./Client";

export default class GlobalClient {
    static emit<E extends keyof Events>(event: E, ...data: Events[E][]) {
        _ThisClients.forEach(client => {
            if (client._RunningEvents.has(event)) {
                client._RunningEvents.get(event).forEach(fn => fn(...data))
            }
        })
    }
}