/**
 * Checks if username includes unabled symbols
 * 
 * @param {string} name username
 * @returns {boolean} true if includes
 */
 export default function checkUserNamesSymbols (name: string): boolean {
    
    const regU = /[^a-zA-Z]/g
    const lenY = name.replace(regU, "").split(" ").join("").length;
    if (lenY < 4) return false;
    
    const reg = /[a-zA-Z0-9._]/g
    const len = name.replace(reg, "").split(" ").join("").length
    return len > 0;
}
