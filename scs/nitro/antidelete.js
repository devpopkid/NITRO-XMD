import config from '../../config.cjs';

let antiDeleteEnabled = false;  // Track whether the anti-delete feature is enabled

const antidelete = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  // Toggle Anti-Delete Feature
  if (cmd === "antidelete") {
    if (text === "on") {
      antiDeleteEnabled = true;
      await sock.sendMessage(m.from, { text: "✅ Anti-delete feature is now **enabled**. Deleted messages will be sent back to you!" });
    } else if (text === "off") {
      antiDeleteEnabled = false;
      await sock.sendMessage(m.from, { text: "❌ Anti-delete feature is now **disabled**. You won't get deleted messages anymore." });
    } else {
      await sock.sendMessage(m.from, { text: "⚠️ Invalid option. Use 'on' or 'off' to toggle the anti-delete feature." });
    }
    return;
  }

  // If Anti-Delete is enabled, listen for deleted messages
  if (antiDeleteEnabled) {
    sock.ev.on('messages.delete', async (deleted) => {
      const { key, from, participant, remoteJid } = deleted[0];

      // Check if the message is from a group (not a broadcast or status message)
      if (remoteJid && remoteJid !== 'status@broadcast') {
        // Retrieve the original deleted message using the key
        const deletedMessage = await sock.loadMessage(from, key.id);
        
        if (deletedMessage) {
          // Prepare the content of the deleted message
          let messageContent = '';
          
          if (deletedMessage.message.conversation) {
            messageContent = deletedMessage.message.conversation; // If it's a text message
          } else if (deletedMessage.message.imageMessage) {
            messageContent = '[📸 Image Message]'; // If it was an image
          } else if (deletedMessage.message.videoMessage) {
            messageContent = '[🎥 Video Message]'; // If it was a video
          } else if (deletedMessage.message.audioMessage) {
            messageContent = '[🎧 Audio Message]'; // If it was an audio
          } else {
            messageContent = '[❗ Unsupported Message Type]';
          }

          // Send a direct message to the user who deleted the message
          if (participant) {
            await sock.sendMessage(participant, { text: `⚠️ Your deleted message: "${messageContent}"` });
          }
        }
      }
    });
  }

  // Example of ping command to respond with pong and response time
  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('⏳');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    const pingText = `*Pong🏓▰▰▰▰▰▰▱▱▱▱ 70${responseTime.toFixed(2)}0 ms*`;
    sock.sendMessage(m.from, { text: pingText }, { quoted: m });
  }
};

export default antidelete;
