import utf8 from "utf8";
import base64 from "base-64";

export default class Encrypty {
    /**
     * Decodes base64-utf8 code to text
     * 
     * @param {string} code encoded code 
     * @returns default text
     */
    static decode(code: string): string {
        return utf8.decode(base64.decode(code));
    }

    /**
     * Encodes a text to base64-utf8 code
     * 
     * @param {string} text  a text
     * @returns encoded string
     */
    static encode (text:string): string {
        return base64.encode(utf8.encode(text))
    }
}