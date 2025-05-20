import _0x3a17d3 from 'dotenv';
_0x3a17d3.config();
import { makeWASocket, fetchLatestBaileysVersion, DisconnectReason, useMultiFileAuthState, getContentType } from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './scs/nitrox/index.js';
import _0x389d38 from 'express';
import _0x2f8874 from 'pino';
import _0x2b3bec from 'fs';
import { File } from 'megajs';
import 'node-cache';
import _0x1c0541 from 'path';
import _0x23f57b from 'chalk';
import 'moment-timezone';
import 'axios';
import _0x541a98 from './config.cjs';
import _0x231063 from './lib/autoreact.cjs';
const {
  emojis,
  doReact
} = _0x231063;
const prefix = process.env.PREFIX || _0x541a98.PREFIX;
const app = _0x389d38();
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 0xbb8;
const MAIN_LOGGER = _0x2f8874({
  'timestamp': () => ",\"time\":\"" + new Date().toJSON() + "\""
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";
const __filename = new URL(import.meta.url).pathname;
const __dirname = _0x1c0541.dirname(__filename);
const sessionDir = _0x1c0541.join(__dirname, "session");
const credsPath = _0x1c0541.join(sessionDir, "creds.json");
if (!_0x2b3bec.existsSync(sessionDir)) {
  _0x2b3bec.mkdirSync(sessionDir, {
    'recursive': true
  });
}
async function downloadSessionData() {
  console.log("Debugging SESSION_ID:", _0x541a98.SESSION_ID);
  if (!_0x541a98.SESSION_ID) {
    console.error("Please add your session to SESSION_ID env !!");
    return false;
  }
  const _0x43975e = _0x541a98.SESSION_ID.split("Buddy;;;")[0x1];
  if (!_0x43975e || !_0x43975e.includes('#')) {
    console.error("Invalid SESSION_ID format! It must contain both file ID and decryption key.");
    return false;
  }
  const [_0x2107d5, _0x134a4b] = _0x43975e.split('#');
  try {
    console.log("🔄 Syncing Session...");
    const _0x277551 = File.fromURL('https://mega.nz/file/' + _0x2107d5 + '#' + _0x134a4b);
    const _0x1bb6a7 = await new Promise((_0x11214b, _0x1a8dfa) => {
      _0x277551.download((_0x63b4ad, _0x558d65) => {
        if (_0x63b4ad) {
          _0x1a8dfa(_0x63b4ad);
        } else {
          _0x11214b(_0x558d65);
        }
      });
    });
    await _0x2b3bec.promises.writeFile(credsPath, _0x1bb6a7);
    console.log("🤳 Session Successfully Loaded !!");
    return true;
  } catch (_0x51268f) {
    console.error("🤖 Failed to download session data:", _0x51268f);
    return false;
  }
}
async function start() {
  try {
    const {
      state: _0x452052,
      saveCreds: _0x5a5861
    } = await useMultiFileAuthState(sessionDir);
    const {
      version: _0xff97a,
      isLatest: _0x33f09e
    } = await fetchLatestBaileysVersion();
    console.log("using WA v" + _0xff97a.join('.') + ", isLatest: " + _0x33f09e);
    const _0x28a0d4 = makeWASocket({
      'version': _0xff97a,
      'logger': _0x2f8874({
        'level': "silent"
      }),
      'printQRInTerminal': useQR,
      'browser': ["Buddy", "safari", "3.3"],
      'auth': _0x452052,
      'getMessage': async _0xc98c3f => {
        if (store) {
          const _0x51ed29 = await store.loadMessage(_0xc98c3f.remoteJid, _0xc98c3f.id);
          return _0x51ed29.message || undefined;
        }
        return {
          'conversation': "whatsapp user bot"
        };
      }
    });
    _0x28a0d4.ev.on("connection.update", _0xdb1d7a => {
      const {
        connection: _0x3ca2d7,
        lastDisconnect: _0x12ba79
      } = _0xdb1d7a;
      if (_0x3ca2d7 === "close") {
        if (_0x12ba79.error?.["output"]?.["statusCode"] !== DisconnectReason.loggedOut) {
          start();
        }
      } else if (_0x3ca2d7 === 'open') {
        if (initialConnection) {
          console.log(_0x23f57b.green("Buddy is now connected"));
          _0x28a0d4.sendMessage(_0x28a0d4.user.id, {
            'image': {
              'url': "https://files.catbox.moe/ld53qr.jpg"
            },
            'caption': "\n╭──────────━⊷ ⁠⁠⁠⁠\n║ 𝕻𝕺𝕻𝕶𝕴𝕯-𝕭𝕽𝕸\n╰──────────━⊷\n╭──────────━⊷\n║ 𝕯𝖊𝖛𝖊𝖑𝖔𝖕𝖊𝖗; 𝕻𝖔𝖕𝖐𝖎𝖉\n║ 𝕷𝖎𝖇𝖗𝖆𝖗𝖞; 𝕭𝖆𝖎𝖑𝖊𝖞𝖘\n║ 𝖎𝖌𝖓𝖎𝖙𝖎𝖔𝖓: *" + prefix + "*\n╰──────────━⊷\nhttps://tinyurl.com/yetanram\n"
          });
          initialConnection = false;
        } else {
          console.log(_0x23f57b.blue("♻️ Connection reestablished after restart."));
        }
      }
    });
    _0x28a0d4.ev.on("creds.update", _0x5a5861);
    _0x28a0d4.ev.on("messages.upsert", async _0x195839 => await Handler(_0x195839, _0x28a0d4, logger));
    _0x28a0d4.ev.on("call", async _0x3e36de => await Callupdate(_0x3e36de, _0x28a0d4));
    _0x28a0d4.ev.on('group-participants.update', async _0x567002 => await GroupUpdate(_0x28a0d4, _0x567002));
    if (_0x541a98.MODE === "public") {
      _0x28a0d4["public"] = true;
    } else if (_0x541a98.MODE === "private") {
      _0x28a0d4['public'] = false;
    }
    _0x28a0d4.ev.on('messages.upsert', async _0x226e55 => {
      try {
        const _0x14e720 = _0x226e55.messages[0x0];
        if (!_0x14e720.key.fromMe && _0x541a98.AUTO_REACT) {
          if (_0x14e720.message) {
            const _0x1220ff = emojis[Math.floor(Math.random() * emojis.length)];
            await doReact(_0x1220ff, _0x14e720, _0x28a0d4);
          }
        }
      } catch (_0x5338e6) {
        console.error("Error during auto reaction:", _0x5338e6);
      }
    });
    _0x28a0d4.ev.on("messages.upsert", async _0x36d2b0 => {
      try {
        const _0x4971c8 = _0x36d2b0.messages[0x0];
        if (!_0x4971c8 || !_0x4971c8.message) {
          return;
        }
        const _0x433745 = getContentType(_0x4971c8.message);
        _0x4971c8.message = _0x433745 === "ephemeralMessage" ? _0x4971c8.message.ephemeralMessage.message : _0x4971c8.message;
        if (_0x4971c8.key.remoteJid === "status@broadcast" && _0x541a98.AUTO_STATUS_REACT === "true") {
          const _0x3734c8 = await _0x28a0d4.decodeJid(_0x28a0d4.user.id);
          const _0xa685cb = ['🦖', '💸', '💨', '🦮', '🐕‍🦺', '💯', '🔥', '💫', '💎', '⚡', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '💻', '🤖', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🔔', '👌', '💥', '⛅', '🌟', '🗿', "🇵🇰", '💜', '💙', '🌝', '💚'];
          const _0xeb1fdf = _0xa685cb[Math.floor(Math.random() * _0xa685cb.length)];
          await _0x28a0d4.sendMessage(_0x4971c8.key.remoteJid, {
            'react': {
              'text': _0xeb1fdf,
              'key': _0x4971c8.key
            }
          }, {
            'statusJidList': [_0x4971c8.key.participant, _0x3734c8]
          });
          console.log("Auto-reacted to a status with: " + _0xeb1fdf);
        }
      } catch (_0x2d33f7) {
        console.error("Auto Like Status Error:", _0x2d33f7);
      }
    });
  } catch (_0x47ef5a) {
    console.error("Critical Error:", _0x47ef5a);
    process.exit(0x1);
  }
}
async function init() {
  if (_0x2b3bec.existsSync(credsPath)) {
    console.log("🔒 Session file found, proceeding without QR code.");
    await start();
  } else {
    const _0x367579 = await downloadSessionData();
    if (_0x367579) {
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
app.get('/', (_0x306948, _0x5bd280) => {
  _0x5bd280.send("CONNECTED SUCCESSFULLY ✅");
});
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
