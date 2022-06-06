import Chest from "../classes/Chest";

const codeListener = new Chest();

export const Listener = {
    code: codeListener
}

export type Listener = typeof Listener;