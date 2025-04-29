import config from '../../config.cjs';

// Temporary storage for incoming messages
const messageStore = new Map();

// Track Anti-Delete ON/OFF per chat
const antiDeleteStatus = new Map();

const antidelete = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim();
  
  const chatId = m.from;

  // Command to toggle Anti-Delete
  if (cmd === "antidelete") {
    if (args.toLowerCase() === "on") {
      antiDeleteStatus.set(chatId, true);
      await sock.sendMessage(chatId, { text: '*✅ Anti-Delete has been ENABLED in this chat.*' }, { quoted: m });
    } else if (args.toLowerCase() === "off") {
      antiDeleteStatus.set(chatId, false);
      await sock.sendMessage(chatId, { text: '*❌ Anti-Delete has been DISABLED in this chat.*' }, { quoted: m });
    } else {
      await sock.sendMessage(chatId, { text: '*Usage:*\n#antidelete on\n#antidelete off' }, { quoted: m });
    }
  }

  // Store ALL incoming messages
  if (m.type !== 'protocolMessage') {
    messageStore.set(m.key.id, {
      key: m.key,
      message: m.message,
      pushName: m.pushName
    });
  }

  // Detect message deletions
  if (m.type === 'protocolMessage' && m.messageStubType === 1) { // Deletion event
    if (antiDeleteStatus.get(chatId)) {
      const deletedMsg = messageStore.get(m.message?.protocolMessage?.key?.id);

      if (deletedMsg) {
        const senderName = deletedMsg.pushName || 'Unknown Sender';

        // Resend the deleted message
        await sock.sendMessage(chatId, { 
          text: `*⚠️ Anti-Delete Detected!*\n\nSender: ${senderName}\nReposting deleted message:` 
        });

        await sock.relayMessage(chatId, deletedMsg.message, { messageId: deletedMsg.key.id });
      } else {
        await sock.sendMessage(chatId, { text: '*⚠️ A message was deleted but could not be recovered.*' });
      }
    }
  }
};

export default antidelete;
