import config from '../../config.cjs';

let autoReplyStatus = new Map(); // For per-chat ON/OFF

const chatbot = async (m, sock) => {
  const prefix = config.PREFIX;
  const isCmd = m.body && m.body.startsWith(prefix);
  const cmd = isCmd ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = isCmd ? m.body.slice(prefix.length + cmd.length).trim() : '';

  const chatId = m.key.remoteJid;

  if (cmd === 'bot') {
    if (args.toLowerCase() === 'on') {
      autoReplyStatus.set(chatId, true);
      await sock.sendMessage(chatId, { text: '*✅ Auto-Reply is now ON!*' }, { quoted: m });
    } else if (args.toLowerCase() === 'off') {
      autoReplyStatus.set(chatId, false);
      await sock.sendMessage(chatId, { text: '*❌ Auto-Reply is now OFF!*' }, { quoted: m });
    } else {
      await sock.sendMessage(chatId, { text: '*⚙️ Usage: .bot on / .bot off*' }, { quoted: m });
    }
    return; // Exit after handling bot command
  }

  const isAutoReplyOn = autoReplyStatus.get(chatId) || false;

  if (isAutoReplyOn && !isCmd) {
    const start = Date.now();
    await sock.sendMessage(chatId, { react: { text: '🤖', key: m.key } }); // React to the message
    const end = Date.now();
    const responseTime = (end - start) / 1000;

    const replyText = `*Hello there! ▰▰▰▰▰▰▱▱▱▱ 70${responseTime.toFixed(2)}0 ms*`;
    await sock.sendMessage(chatId, { text: replyText }, { quoted: m });
  }
}

export default chatbot;
