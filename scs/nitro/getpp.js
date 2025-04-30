import config from '../../config.cjs';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'node:fs/promises';
import path from 'node:path';

const setProfilePicture = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'set' && m.body.toLowerCase().includes('pp')) {
    if (!m.quoted?.image) {
      return m.reply("💖 *Pretty please, reply to an image with the command!* 🌸");
    }

    try {
      await m.reply('✨ *Pinkifying your profile...* 🎀');
      const media = await downloadMediaMessage(m.quoted, 'buffer');
      const tempFilePath = path.join(process.cwd(), 'temp_pp.jpg');
      await fs.writeFile(tempFilePath, media);

      await sock.updateProfilePicture(m.sender, { url: tempFilePath });
      await fs.unlink(tempFilePath);
      await m.reply('🌷 *Profile picture updated with a touch of pink magic!* 💕');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      await m.reply('💔 *Oh dear, something went wrong while setting the profile picture.* 😔');
    }
  }
};

export default setProfilePicture;
