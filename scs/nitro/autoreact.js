import config from '../../config.cjs';

let autoreact = false;

// List of emojis to react with
const emojis = ['👍', '🔥', '😂', '❤️', '💯', '😎', '👏', '✨', '🥳', '🤖'];

const autoreactHandler = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  // Toggle command
  if (cmd === "autoreact") {
    const arg = m.body.split(' ')[1]?.toLowerCase();
    if (arg === "on") {
      autoreact = true;
      await sock.sendMessage(m.from, { text: "*Auto-react is now ON.*" }, { quoted: m });
    } else if (arg === "off") {
      autoreact = false;
      await sock.sendMessage(m.from, { text: "*Auto-react is now OFF.*" }, { quoted: m });
    } else {
      await sock.sendMessage(m.from, { text: "*Usage:* .autoreact on / off" }, { quoted: m });
    }
    return;
  }

  // Auto-react if enabled
  if (autoreact) {
    try {
      // Choose a random emoji from the list
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      await m.react(emoji);
    } catch (err) {
      console.error("Failed to react:", err);
    }
  }
};

export default autoreactHandler;
