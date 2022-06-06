/**
 * Encodes < > & " '
 * 
 * @param {string} text 
 * 
 */
 export function encodeHtml(text: string) {
    return text.replaceAll("<", "&lt").replaceAll(">", "&gt").replaceAll("\"", "&quot").replaceAll("'", "&apos");
}

/**
 * Decodes %aplg 
 */
export function decodeHtml(text: string) {
    return text.replaceAll("&lt", "<").replaceAll("&gt", ">").replaceAll("&quot", "\"").replaceAll("&apos", "'");
}
