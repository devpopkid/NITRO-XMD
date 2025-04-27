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
      if (!deleted || deleted.length === 0) return; // Avoid errors if deleted array is empty
      const { key, participant, remoteJid } = deleted[0];

      // Check if the message is from a group (not a broadcast or status message) and not our own message
      if (remoteJid && remoteJid !== 'status@broadcast' && key.fromMe === false) {
        try {
          const deletedMessage = await sock.loadMessage(remoteJid, key.id);

          if (deletedMessage && deletedMessage.message) {
            const originalMessage = deletedMessage.message;
            let resendContent = null;
            let messageType = Object.keys(originalMessage)[0]; // Get the type of the message

            if (messageType === 'conversation') {
              resendContent = { text: originalMessage.conversation };
            } else if (messageType === 'imageMessage') {
              resendContent = { image: await sock.downloadMediaMessage(originalMessage.imageMessage), caption: originalMessage.imageMessage.caption || '' };
            } else if (messageType === 'videoMessage') {
              resendContent = { video: await sock.downloadMediaMessage(originalMessage.videoMessage), caption: originalMessage.videoMessage.caption || '', gifPlayback: originalMessage.videoMessage.gifPlayback || false };
            } else if (messageType === 'audioMessage') {
              resendContent = { audio: await sock.downloadMediaMessage(originalMessage.audioMessage), mimetype: originalMessage.audioMessage.mimetype };
            } else if (messageType === 'stickerMessage') {
              resendContent = { sticker: await sock.downloadMediaMessage(originalMessage.stickerMessage) };
            } else if (messageType === 'documentMessage') {
              resendContent = { document: await sock.downloadMediaMessage(originalMessage.documentMessage), mimetype: originalMessage.documentMessage.mimetype, fileName: originalMessage.documentMessage.fileName };
            } else if (messageType === 'extendedTextMessage' && originalMessage.extendedTextMessage.text) {
              resendContent = { text: originalMessage.extendedTextMessage.text };
            }

            if (resendContent && participant) {
              await sock.sendMessage(participant, { text: `⚠️ **DELETED MESSAGE FROM:** ${deletedMessage.pushName || 'Unknown'}\n\n` });
              await sock.sendMessage(participant, resendContent);
            }
          }
        } catch (error) {
          console.error("Error processing deleted message:", error);
          if (participant) {
            await sock.sendMessage(participant, { text: "⚠️ Failed to retrieve the deleted message." });
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
