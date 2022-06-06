/**
 * Replaces \n at start and end to <br>
 * 
 * @param {string} text a string
 * @param {boolean} remove 
 * @returns {string}
 */
 export default function splitSpaces (text: string, remove?: boolean): string {
    var r1 = text.replaceAll("\n", "<br>");
    while (r1.startsWith("<br>")) {
        r1 = r1.slice(4)
    }
    while (r1.endsWith("<br>")) {
        r1 = r1.slice(0, r1.length - 4)
    }
    if (!remove) return r1;
    return r1.replaceAll("<br>", "\n")
}