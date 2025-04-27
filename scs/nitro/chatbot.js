import config from '../../config.cjs';
import { askAI } from './lib/ai.js'; // NEW: a helper that talks to AI

let autoReplyStatus = new Map(); // For per-chat ON/OFF

const chatbot = async (m, sock) => {
  const prefix = config.PREFIX;
  const isCmd = m.body && m.body.startsWith(prefix);
  const cmd = isCmd ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = isCmd ? m.body.slice(prefix.length + cmd.length).trim() : '';

  const chatId = m.key.remoteJid;

  if (cmd === 'bot') {
    const arg = args.toLowerCase();
    if (arg === 'on' || arg === 'off') {
      autoReplyStatus.set(chatId, arg === 'on');
      await sock.sendMessage(chatId, { text: `*${arg === 'on' ? '✅ Chatbot is now ON!' : '❌ Chatbot is now OFF!'}*` }, { quoted: m });
    } else {
      await sock.sendMessage(chatId, { text: '*⚙️ Usage: .bot on / .bot off*' }, { quoted: m });
    }
    return;
  }

  const isAutoReplyOn = autoReplyStatus.get(chatId) || false;

  if (isAutoReplyOn && !isCmd) {
    await sock.sendMessage(chatId, { react: { text: '🤖', key: m.key } });

    const userMessage = m.body;
    const botReply = await askAI(userMessage); // NEW: Ask AI model
    await sock.sendMessage(chatId, { text: botReply }, { quoted: m });
  }
}

export default chatbot;
