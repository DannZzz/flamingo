export default {
    MONGO: process.env.MONGO || "mongodb+srv://DannTest:099075020@botdiscord.hkvvx.mongodb.net/web_chat"
}

export const PORT = +process.env.PORT || 3000;

export const Link = process.env.Link || `http://localhost:${PORT}/`;

export const GMAIL_NAME = process.env.GMAIL_NAME || "dann.alowed@gmail.com";

export const GMAIL_PASS = process.env.GMAIL_PASS || "vard04mak";

export const client_id = process.env.client_id || '970217615538655244';
export const client_secret = process.env.client_secret || 'OPLFzlk9jxpEnl9ivhNkGLw-gi7TjwEv';

export const DISCORD_AUTH_URL = process.env.DISCORD_AUTH_URL || "https://discord.com/api/oauth2/authorize?client_id=970217615538655244&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord&response_type=code&scope=identify";

export const CloudinaryConfig = {
    cloud_name: process.env.cloud_name || 'dwkaanyme',
    api_key: process.env.api_key || '931571425353155',
    api_secret: process.env.api_secret || 'ImpuN4OQ_cpqz7c9jMDC8g5uqNo'
}

export const BackgroundImages = {
    1: { // dark
        url: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetwallpapers.com%2Fwallpaper%2Ffull%2Fd%2F3%2F2%2F64624.jpg&f=1&nofb=1',
        textColor: "#fff",
        backgroundColor: "#36393e",
        hr: "#000"
    },
    2: { // light
        url: "https://images6.alphacoders.com/377/377152.jpg",
        textColor: "#000",
        backgroundColor: "#a8dde5",
        hr: "#e9e9e9"
    }
}