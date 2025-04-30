import config from '../../config.cjs';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const setppCommands = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  // Validate command target
  const isImageReply = m.quoted && m.quoted.type === 'imageMessage';
  if ((cmd === 'setpp' || cmd === 'setgpp') && !isImageReply) {
    return sock.sendMessage(m.from, {
      text: `⚠️ *Reply to an image* with \`.${cmd}\` to set a profile picture.\n\n🔧 _Powered by POPKID XMD_`,
    }, { quoted: m });
  }

  try {
    if (cmd === 'setpp') {
      // User profile picture change (only in private)
      if (m.key.remoteJid.endsWith('@g.us')) {
        return sock.sendMessage(m.from, {
          text: '❌ You can only use `.setpp` in a *private chat* to update your profile picture.\n\n🔧 _Powered by POPKID XMD_',
        }, { quoted: m });
      }

      const imageBuffer = await downloadMediaMessage(m.quoted, 'buffer', {}, { reuploadRequest: sock });
      await sock.updateProfilePicture(m.from, imageBuffer);
      await sock.sendMessage(m.from, {
        text: '✅ *Profile picture updated successfully!*\n\n🧑‍💼 _You’re looking fresh!_\n\n🔧 _Powered by POPKID XMD_',
      }, { quoted: m });
    }

    if (cmd === 'setgpp') {
      // Group profile picture change
      if (!m.key.remoteJid.endsWith('@g.us')) {
        return sock.sendMessage(m.from, {
          text: '❌ Use `.setgpp` *inside a group* to change the group profile picture.\n\n🔧 _Powered by POPKID XMD_',
        }, { quoted: m });
      }

      const groupMetadata = await sock.groupMetadata(m.from);
      const senderId = m.key.participant || m.sender;
      const isAdmin = groupMetadata.participants
        .find(p => p.id === senderId)
        ?.admin;

      if (!isAdmin) {
        return sock.sendMessage(m.from, {
          text: '⛔ Only *group admins* can change the group profile picture.\n\n🔧 _Powered by POPKID XMD_',
        }, { quoted: m });
      }

      const imageBuffer = await downloadMediaMessage(m.quoted, 'buffer', {}, { reuploadRequest: sock });
      await sock.updateProfilePicture(m.from, imageBuffer);
      await sock.sendMessage(m.from, {
        text: '✅ *Group profile picture updated successfully!*\n\n👥 _New vibe, who dis?_\n\n🔧 _Powered by POPKID XMD_',
      }, { quoted: m });
    }
  } catch (err) {
    console.error('Profile picture update error:', err);
    sock.sendMessage(m.from, {
      text: '❌ *Failed to update profile picture.* Please try again later.\n\n🔧 _Powered by POPKID XMD_',
    }, { quoted: m });
  }
};

export default setppCommands;
