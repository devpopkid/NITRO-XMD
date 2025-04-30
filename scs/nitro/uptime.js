import pkg from '@whiskeysockets/baileys';
const { proto } = pkg;

const alive = async (m, sock) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const prefixRegex = /^[\\/!#.]/gi;
  const prefixMatch = m.body.match(prefixRegex);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const bodyWithoutPrefix = m.body.slice(prefix.length).trim();
  const cmd = bodyWithoutPrefix.toLowerCase();

  if (['alive', 'uptime', 'runtime'].includes(cmd)) {
    const uptimeMessage = `
🟢 *POPKID MD is Online!*

⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s
⚙️ *Framework:* Baileys API
👤 *User:* @${m.sender.split('@')[0]}
`;

    const templateButtons = [
      { index: 1, quickReplyButton: { displayText: '⚡ Ping', id: `${prefix}ping` } },
    ];

    const message = {
      text: uptimeMessage,
      footer: '🔥 POPKID',
      templateButtons: templateButtons,
      mentions: [m.sender]
    };

    try {
      await sock.sendMessage(m.from, message, { quoted: m });
    } catch (error) {
      console.error("Error sending alive message:", error);
      await sock.sendMessage(m.from, { text: "⚠️ Failed to send alive message." }, { quoted: m });
    }
  }
};

export default alive;
