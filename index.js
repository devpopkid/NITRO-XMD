// All your imports remain unchanged import dotenv from 'dotenv'; dotenv.config();

import { makeWASocket, Browsers, fetchLatestBaileysVersion, DisconnectReason, useMultiFileAuthState, } from '@whiskeysockets/baileys';

import { Handler, Callupdate, GroupUpdate } from './scs/nitrox/index.js'; import express from 'express'; import pino from 'pino'; import fs from 'fs'; import NodeCache from 'node-cache'; import path from 'path'; import chalk from 'chalk'; import moment from 'moment-timezone'; import axios from 'axios'; import config from './config.cjs'; import pkg from './lib/autoreact.cjs'; import { File } from 'megajs';

import { fileURLToPath } from 'url';

const { emojis, doReact } = pkg;

const sessionName = "session"; const app = express(); const green = chalk.bold.hex("#00FF00"); const red = chalk.bold.hex("#FF0000"); const neon = chalk.bold.hex("#39FF14"); let useQR = false; let initialConnection = true; const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({ timestamp: () => ,"time":"${new Date().toJSON()}" }); const logger = MAIN_LOGGER.child({}); logger.level = "trace";

const msgRetryCounterCache = new NodeCache();

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);

const sessionDir = path.join(__dirname, 'session'); const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

async function downloadSessionData() { console.log("🛠️ Debugging SESSION_ID:", config.SESSION_ID ? '[REDACTED]' : 'None');

if (!config.SESSION_ID) {
    console.error(red('❌ Please add your session to SESSION_ID env !!'));
    return false;
}

const sessdata = config.SESSION_ID.split("POPKID;;;")[1];
if (!sessdata || !sessdata.includes("#")) {
    console.error(red('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.'));
    return false;
}

const [fileID, decryptKey] = sessdata.split("#");

try {
    console.log("🔄 Downloading Session...");
    const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

    const data = await new Promise((resolve, reject) => {
        file.download((err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

    await fs.promises.writeFile(credsPath, data);
    console.log(green("🔒 Session Successfully Loaded !!"));
    return true;
} catch (error) {
    console.error(red('❌ Failed to download session data:'), error);
    return false;
}

}

const lifeQuotes = [ "The only way to do great work is to love what you do.", "Strive not to be a success, but rather to be of value.", "The mind is everything. What you think you become.", "The best time to plant a tree was 20 years ago. The second best time is now.", "Life is what happens when you're busy making other plans.", "Be the change that you wish to see in the world.", "The future belongs to those who believe in the beauty of their dreams.", "It is never too late to be what you might have been.", "Do not wait to strike till the iron is hot; but make the iron hot by striking.", "The journey of a thousand miles begins with a single step." ];

async function updateBio(Matrix) { try { const now = moment().tz('Africa/Nairobi'); const time = now.format('HH:mm:ss'); const randomQuote = lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)]; const bio = 🧋POP KID XMD ACTIVE 🧋 ${time} | ${randomQuote}; await Matrix.updateProfileStatus(bio); console.log(chalk.yellow(ℹ️ Bio updated to: "${bio}")); } catch (error) { console.error(chalk.red('Failed to update bio:'), error); } }

async function updateLiveBio(Matrix) { try { const now = moment().tz('Africa/Nairobi'); const time = now.format('HH:mm:ss'); const bio = 🧋POP KID XMD LIVE🧋 ${time}; await Matrix.updateProfileStatus(bio); } catch (error) { console.error(chalk.red('Failed to update live bio:'), error); } }

async function start() { try { const { state, saveCreds } = await useMultiFileAuthState(sessionDir); const { version, isLatest } = await fetchLatestBaileysVersion(); console.log(neon(💻 CONNECTING WITH WA v${version.join('.')} | LATEST: ${isLatest}));

const Matrix = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: useQR,
        browser: ["POP-KID", "HACK-OS", "9.9"],
        auth: state,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg.message || undefined;
            }
            return { conversation: "POPKID WHATSAPP XMD" };
        }
    });

    Matrix.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(red(`❌ Disconnected. Reason: ${reason}`));
            if (reason !== DisconnectReason.loggedOut) start();
        } else if (connection === 'open') {
            console.log(neon("🟢 SYSTEM ONLINE: POPKID XMD INITIATED"));

            await Matrix.newsletterFollow("120363290715861418@newsletter");
            console.log(green("📬 Newsletter Subscribed"));

            await updateBio(Matrix);

            await Matrix.sendMessage(Matrix.user.id, {
                image: { url: "https://files.catbox.moe/nk71o3.jpg" },
                caption: `🟢 SYSTEM INITIATED\n🔰 BOT: POPKID XMD\n👑 OWNER: POPKID\n⚙️ MODE: ${config.MODE}\n🎯 PREFIX: ${config.PREFIX}\n✅ STATUS: ACTIVE\n⚡ UPLINK: OK\n\n👾 POWERED BY POPKID NETWORK`,
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363290715861418@newsletter',
                        newsletterName: "popkid xmd ʙᴏᴛ",
                        serverMessageId: -1,
                    },
                    externalAdReply: {
                        title: "POP KID XMD SYSTEM",
                        body: "Autonomous Control Online",
                        thumbnailUrl: 'https://files.catbox.moe/nk71o3.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029VajweHxKQuJP6qnjLM31',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            });

            if (!global.isLiveBioRunning) {
                global.isLiveBioRunning = true;
                setInterval(() => updateLiveBio(Matrix), 60000);
            }
            initialConnection = false;
        }
    });

    Matrix.ev.on('creds.update', saveCreds);

    Matrix.ev.on("messages.upsert", async chatUpdate => {
        if (!chatUpdate.messages || !chatUpdate.messages.length) return;
        await Handler(chatUpdate, Matrix, logger);
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                await doReact(randomEmoji, mek, Matrix);
            }
        } catch (err) {
            console.error('Error during auto reaction:', err);
        }
    });

    Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
    Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

    Matrix.public = config.MODE === "public";

} catch (error) {
    console.error('❌ Fatal Error:', error.stack || error);
    process.exit(1);
}

}

async function init() { global.isLiveBioRunning = false; if (fs.existsSync(credsPath)) { console.log("🔒 Using existing session file."); await start(); } else { const sessionDownloaded = await downloadSessionData(); if (sessionDownloaded) { console.log("🔒 Session downloaded, launching bot."); await start(); } else { console.log("📸 No session found, QR authentication enabled."); useQR = true; await start(); } } }

init();

// Static web hosting app.use(express.static(path.join(__dirname, 'mydata'))); app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'mydata', 'index.html')); }); app.listen(PORT, () => { console.log(green(🌐 Server live on port ${PORT})); });

// Prevent sleep (self-ping every 4.5 min) setInterval(async () => { try { await axios.get(http://localhost:${PORT}); } catch (e) { console.error("Ping error:", e.message); } }, 270000);

