import config from '../../config.cjs';

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('⏳'); // Sending a "waiting" emoji

    // Simulate typing (optional, for visual feedback)
    await sock.sendPresenceUpdate('composing', m.from);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Adjust time as needed
    await sock.sendPresenceUpdate('paused', m.from);

    const end = new Date().getTime();
    const responseTime = (end - start); // in milliseconds

    const circles = ['○', '◔', '◕'];
    let animation = '';
    for (let i = 0; i < 10; i++) {
      animation += circles[i % circles.length];
    }

    const text = `\`\`\`\n${animation} Pinging Server...\n\`\`\`\n*Response Time:* \`${responseTime} ms\`\n${getFancyMessage()}`;
    sock.sendMessage(m.from, { text }, { quoted: m });
  }
}

function getFancyMessage() {
  const messages = [
    "⚡️ Zoom! That was fast!",
    "💨 Like a ninja!",
    "🚀 Blazing speed!",
    "✨ Almost instantaneous!",
    "🌐 Connected in a blink!",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export default ping;
