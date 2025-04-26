Import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';

import { Handler, Callupdate, GroupUpdate } from './scs/nitrox/index.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';

import { fileURLToPath } from 'url';

const { emojis, doReact } = pkg;

const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    if (!config.SESSION_ID) {
        console.error('Please add your session to SESSION_ID env !!');
        return false;
    }
    const sessdata = config.SESSION_ID.split("POPKID$")[1];
    const url = `https://pastebin.com/raw/${sessdata}`;
    try {
        const response = await axios.get(url);
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('Failed to download session data');
        return false;
    }
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`POPKID md using WA v${version.join('.')}, isLatest: ${isLatest}`);

        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["popkid", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return { conversation: "joel md whatsapp user bot" };
            }
        });

        Matrix.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    start();
                }
            } else if (connection === 'open') {
                if (initialConnection) {
                    console.log(chalk.green("✔️  ᴘᴏᴘᴋɪᴅ ᴍᴅ ɪs ɴᴏᴡ ᴏɴʟɪɴᴇ ᴀɴᴅ ᴘᴏᴡᴇʀᴇᴅ ᴜᴘ"));

                    const image = { url: "https://files.catbox.moe/nk71o3.jpg" };
                    const caption = `╭━━ *『 ᴘᴏᴘᴋɪᴅ xᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ 』*
┃
┃  |⚡| *ʙᴏᴛ ɴᴀᴍᴇ:* ᴘᴏᴘᴋɪᴅ xᴍᴅ
┃  |👑| *ᴏᴡɴᴇʀ:* ᴘᴏᴘᴋɪᴅ
┃  |⚙️| *ᴍᴏᴅᴇ:* ${config.MODE}
┃  |🎯| *ᴘʀᴇꜰɪx:* ${config.PREFIX}
┃  |✅| *ꜱᴛᴀᴛᴜꜱ:* ᴏɴʟɪɴᴇ & ꜱᴛᴀʙʟᴇ
┃
╰━━━━━━━━━━━━━━━━━━━╯

*ɪᴛs ʏᴏᴜ,ᴍᴇ,ᴜs🧋🩷.*

╭──────────────────
│ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ*
╰──────────────────`;

                    const messagePayload = {
                        image,
                        caption,
                        contextInfo: {
                            isForwarded: true,
                            forwardingScore: 999,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363290715861418@newsletter',
                                newsletterName: "popkid xmd ʙᴏᴛ",
                                serverMessageId: -1,
                            },
                            externalAdReply: {
                                title: "ᴘᴏᴘᴋɪᴅ xᴍᴅ ʙᴏᴛ",
                                body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ",
                                thumbnailUrl:
                                    'https://files.catbox.moe/nk71o3.jpg',
                                sourceUrl: 'https://whatsapp.com/channel/0029VajweHxKQuJP6qnjLM31',
                                mediaType: 1,
                                renderLargerThumbnail: false,
                            },
                        },
                    };

                    await Matrix.sendMessage(Matrix.user.id, messagePayload);
                    initialConnection = false;
                } else {
                    console.log(chalk.blue("♻️ Connection reestablished after restart."));
                }
            }
        });

        Matrix.ev.on('creds.update', saveCreds);
        Matrix.ev.on("messages.upsert", async chatUpdate => await Handler(chatUpdate, Matrix, logger));
        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

        // Auto reaction to messages
        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.key.fromMe && config.AUTO_REACT) {
                    if (mek.message) {
                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        await doReact(randomEmoji, mek, Matrix);
                    }
                }
            } catch (err) {
                console.error('Error during auto message reaction:', err);
            }
        });

        // Auto reaction to status updates
        Matrix.ev.on('status.upsert', async (statusUpdate) => {
            try {
                if (statusUpdate && statusUpdate.broadcast === 'status' && !statusUpdate.key.fromMe) {
                    const statusJid = statusUpdate.key.remoteJid;
                    const availableReactions = ['🥰', '💍', '☺️', '🪆', '✅', '💖', '⭐', '😊', '❤️', '😔', '💚', '💛', '🧡', '💙', '❤️', '💜', '🤎'];
                    const randomReaction = availableReactions[Math.floor(Math.random() * availableReactions.length)];

                    await Matrix.sendReaction(statusJid, randomReaction, statusUpdate.key);
                    console.log(chalk.blue(`Reacted to status of ${statusJid} with: ${randomReaction}`));
                }
            } catch (error) {
                console.error('Error during auto status reaction:', error);
            }
        });

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

async function init() {
    if (fs.existsSync(credsPath)) {
        console.log("🔒 Session file found, proceeding without QR code.");
        await start();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("🔒 Session downloaded, starting bot.");
            await start();
        } else {
            console.log("No session found or downloaded, QR code will be printed for authentication.");
            useQR = true;
            await start();
        }
    }
}

init();

// Serve static files from 'mydata' folder
app.use(express.static(path.join(__dirname, 'mydata')));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mydata', 'index.html'));
});

// Start express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
