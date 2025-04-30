import config from '../../config.cjs';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import fs from 'node:fs/promises';
import path from 'node:path';

const autoUpdateProfilePicture = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'setpp' && m.hasQuotedMsg && m.quotedMsg.image) {
    try {
      await m.react('🖼️'); // React to show processing

      const buffer = await downloadMediaMessage(
        m.quotedMsg,
        'image',
        {},
        { reupload: false } // Set to false to prevent re-uploading if already cached
      );

      if (buffer) {
        // Save the downloaded image temporarily
        const tempImagePath = path.join(process.cwd(), 'temp_profile_image.jpg');
        await fs.writeFile(tempImagePath, buffer);

        // Update the profile picture
        await sock.updateProfilePicture(m.from, { url: tempImagePath });

        // Clean up the temporary file
        await fs.unlink(tempImagePath);

        await m.reply('✅ Profile picture updated!');
      } else {
        await m.reply('❌ Failed to download the image.');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      await m.reply('❌ An error occurred while updating the profile picture.');
    }
  }
};

export default autoUpdateProfilePicture;
