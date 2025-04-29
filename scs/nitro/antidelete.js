import config from '../../config.cjs';

// Temporary storage for incoming messages
const messageStore = new Map();

// Track Anti-Delete ON/OFF per chat
const antiDeleteStatus = new Map();

const antidelete = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body?.slice(prefix.length + cmd.length).trim();
  const chatId = m.from;

  // Command to toggle Anti-Delete
  if (cmd === "antidelete") {
    if (args?.toLowerCase() === "on") {
      // Suggesting a "drawing" or "writing" effect
      await sock.sendMessage(chatId, { text: '*✍️ Enabling Anti-Delete... Done! ✅*' }, { quoted: m });
      antiDeleteStatus.set(chatId, true);
    } else if (args?.toLowerCase() === "off") {
      // Suggesting "crossing out" or "erasing"
      await sock.sendMessage(chatId, { text: '*🖋️ Disabling Anti-Delete... ❌*' }, { quoted: m });
      antiDeleteStatus.set(chatId, false);
    } else {
      await sock.sendMessage(chatId, { text: '*Usage:*\n#antidelete on\n#antidelete off' }, { quoted: m });
    }
  }

  // Store ALL incoming messages (excluding protocol messages and own messages)
  if (m.type !== 'protocolMessage' && !m.key.fromMe && m.message) {
    messageStore.set(m.key.id, {
      key: m.key,
      message: m.message,
      pushName: m.pushName
    });
  }

  // Detect message deletions
  if (m.type === 'protocolMessage' && m.messageStubType === 1) { // Deletion event
    if (antiDeleteStatus.get(chatId)) {
      const deletedMessageKey = m.message?.protocolMessage?.key?.remoteJid === chatId ?
        m.message.protocolMessage.key.id :
        undefined;

      if (deletedMessageKey) {
        const deletedMsg = messageStore.get(deletedMessageKey);

        if (deletedMsg) {
          const senderName = deletedMsg.pushName || 'Unknown Sender';

          await sock.sendMessage(chatId, {
            text: `*⚠️ <0xF0><0x9F><0x95><0xB3>️ Anti-Delete Activated! Recovering deleted message...*\n\nSender: ${senderName}\nReposting deleted message:`
          });

          await sock.relayMessage(chatId, deletedMsg.message, { messageId: deletedMsg.key.id });
        } else {
          await sock.sendMessage(chatId, { text: '*⚠️ A message was deleted but could not be recovered (it might have been sent before the bot started).*' });
        }
      } else {
        await sock.sendMessage(chatId, { text: '*⚠️ A message was deleted but its details could not be identified.*' });
      }
    }
  }
};

export default antidelete;
