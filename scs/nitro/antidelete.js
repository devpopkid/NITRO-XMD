import config from '../../config.cjs';

let antiDeleteEnabled = false; // Global variable to track the state

const antidelete = async (m, sock, store) => {
  if (!antiDeleteEnabled) {
    return; // Anti-delete is off, so do nothing
  }

  if (m.key.remoteJid === 'status@broadcast') {
    return; // Ignore status updates
  }

  if (m.messageStubType === 19 || m.messageStubType === 20) {
    const jid = m.key.remoteJid;
    const participant = m.key.participant;
    const isGroup = jid.endsWith('@g.us');

    let senderName = m.pushName || 'Unknown';
    if (isGroup && participant) {
      const groupMetadata = store.chats[jid]?.metadata;
      senderName = groupMetadata?.participants.find(p => p.id === participant)?.pushName || 'Unknown';
    }

    const deletedMessageType = m.messageStubType === 19 ? 'message' : 'media';
    const chat = store.chats[jid];
    const lastMessage = chat?.messages.all().find(msg => msg.key.id === m.key.id);

    if (lastMessage?.message) {
      const messageContent = lastMessage.message;
      let textToSend = `⚠️ *Anti-Delete Detected!* ⚠️\n\n`;
      textToSend += `A deleted ${deletedMessageType} from *${senderName}* in *${isGroup ? chat?.name || jid : 'Direct Chat'}* was detected.\n\n`;

      if (messageContent.conversation) {
        textToSend += `💬 *Message:* ${messageContent.conversation}`;
      } else if (messageContent.imageMessage) {
        textToSend += `🖼️ *Type:* Image\n`;
        textToSend += `_Could not retrieve the original image._`;
      } else if (messageContent.videoMessage) {
        textToSend += `📹 *Type:* Video\n`;
        textToSend += `_Could not retrieve the original video._`;
      } else if (messageContent.audioMessage) {
        textToSend += `🎵 *Type:* Audio\n`;
        textToSend += `_Could not retrieve the original audio._`;
      } else if (messageContent.stickerMessage) {
        textToSend += `👾 *Type:* Sticker\n`;
        textToSend += `_Could not retrieve the original sticker._`;
      } else if (messageContent.documentMessage) {
        textToSend += `📄 *Type:* Document\n`;
        textToSend += `_Could not retrieve the original document._`;
      } else if (messageContent.locationMessage) {
        textToSend += `📍 *Type:* Location\n`;
        textToSend += `_Could not retrieve the original location._`;
      } else if (messageContent.contactMessage) {
        textToSend += `👤 *Type:* Contact\n`;
        textToSend += `_Could not retrieve the original contact._`;
      } else {
        textToSend += `❓ *Type:* Unknown`;
      }

      try {
        await sock.sendMessage(m.sender, { text: textToSend });
      } catch (error) {
        console.error("Error sending antidelete message:", error);
      }
    }
  }
};

const toggleantidelete = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'antidelete') {
    antiDeleteEnabled = !antiDeleteEnabled;
    const status = antiDeleteEnabled ? '*on*' : '*off*';
    const response = `Anti-delete feature is now turned ${status}.`;
    sock.sendMessage(m.from, { text: response }, { quoted: m });
  }
};

export { antidelete, toggleantidelete };
