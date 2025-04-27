import config from '../../config.cjs';

let antideleteEnabled = false; // Keep track of the antidelete state

const antidelete = async (m, sock, store) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "antidelete") {
    antideleteEnabled = !antideleteEnabled;
    const status = antideleteEnabled ? '*Anti-delete is now ON! 🛡️ Deleted messages will be shown here.*' : '*Anti-delete is now OFF! 🚫 Deleted messages will no longer be displayed.*';
    sock.sendMessage(m.from, { text: status }, { quoted: m });
    return; // Exit the function after toggling the state
  }

  // Listen for message deletions only if antidelete is enabled
  if (antideleteEnabled && m.type === 'message_revoke') {
    if (m.key.fromMe) return; // Don't show if the bot deleted it

    // Fetch the original message content if available in the store
    const deletedMessage = store?.messages[m.key.remoteJid]?.find(
      (msg) => msg.key.id === m.key.id
    );

    if (deletedMessage?.message) {
      const senderName = m.pushName ? m.pushName : 'Someone';
      let messageContent = '';

      if (deletedMessage.message.ephemeralMessage) {
        messageContent = '*(Ephemeral Message Deleted)*\n' + Object.keys(deletedMessage.message.ephemeralMessage.message)[0];
      } else {
        messageContent = Object.keys(deletedMessage.message)[0];
        if (messageContent === 'conversation') {
          messageContent = deletedMessage.message.conversation;
        } else if (messageContent === 'imageMessage') {
          messageContent = '🖼️ _(Image Deleted)_';
        } else if (messageContent === 'videoMessage') {
          messageContent = '🎬 _(Video Deleted)_';
        } else if (messageContent === 'audioMessage') {
          messageContent = '🎵 _(Audio Deleted)_';
        } else if (messageContent === 'stickerMessage') {
          messageContent = ' sticker _(Sticker Deleted)_';
        } else if (messageContent === 'documentMessage') {
          messageContent = '📄 _(Document Deleted)_';
        } else if (messageContent === 'locationMessage') {
          messageContent = '📍 _(Location Deleted)_';
        } else if (messageContent === 'contactMessage') {
          messageContent = '👤 _(Contact Deleted)_';
        }
      }

      const displayText = `⚠️ *DELETED MESSAGE DETECTED!* ⚠️\n\n👤 *Sender:* ${senderName}\n💬 *Message:* ${messageContent}`;
      sock.sendMessage(m.from, { text: displayText });
    } else {
      // If the message isn't in the store, we can only indicate a deletion
      const displayText = `⚠️ *DELETED MESSAGE DETECTED!* ⚠️\n\n_(Original content not available)_`;
      sock.sendMessage(m.from, { text: displayText });
    }
  }
};

export default antidelete;
