/**
 * Removes unabled symbols from username
 * 
 * @param {string} name username
 * @returns {string} username without symbols
 */
 export default function removeUsernameChars (name: string): string {
    const reg = /[a-zA-Z0-9._]/g
    return name.replace(reg, "").split(" ").join("")
}