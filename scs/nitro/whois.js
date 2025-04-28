import config from '../../config.cjs';
import { fileTypeFromBuffer } from 'file-type';
import fetch from 'node-fetch';

const whoisCommand = async (m, Matrix) => {
  if (!m.body.startsWith(config.PREFIX + 'whois')) {
    return;
  }

  const jid = m.mentionedJid[0] || m.quoted?.sender || m.sender;

  if (!jid) {
    return m.reply('👤 Tag a user or reply to their message to get their info.');
  }

  try {
    const ppUrl = await Matrix.profilePictureUrl(jid, 'image');
    const buffer = await fetch(ppUrl).then(res => res.buffer());
    const type = await fileTypeFromBuffer(buffer);

    let profilePic;
    if (type?.mime) {
      profilePic = {
        image: buffer,
        mimetype: type.mime,
        caption: `👤 Profile Info for ${jid.split('@')[0]}`,
      };
    } else {
      profilePic = {
        image: buffer,
        caption: `👤 Profile Info for ${jid.split('@')[0]} (Could not determine image type)`,
      };
    }

    const vcard = 'BEGIN:VCARD\n' +
      'VERSION:3.0\n' +
      `FN:${jid.split('@')[0]}\n` + // Full Name (can be customized further)
      `TEL;type=CELL;waid=${jid.split('@')[0]}:${jid.split('@')[0]}\n` + // WhatsApp ID as phone number
      'END:VCARD';

    await Matrix.sendMessage(m.from, profilePic, { quoted: m });
    await Matrix.sendMessage(m.from, { contacts: { displayName: jid.split('@')[0], contacts: [{ vcard }] } }, { quoted: m });

  } catch (error) {
    console.error('⚠️ Error fetching profile info:', error);
    m.reply('⚠️ Could not retrieve profile information for that user.');
  }
};

export default whoisCommand;
