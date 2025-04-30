import config from '../../config.cjs';
import { readFile } from 'fs/promises';

const setProfilePicture = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "setpp" || cmd === "setprofilepicture") {
    if (!m.quoted?.image && !text) {
      await m.reply(`Please reply to an image or provide the file path to the image you want to set as your profile picture.`);
      return;
    }

    await m.react('⏳');

    try {
      let buffer;
      if (m.quoted?.image) {
        const media = await sock.downloadAndSaveMediaMessage(m.quoted, 'profile');
        buffer = await readFile(media);
        // You might want to delete the temporary file here for cleanup
        // await unlink(media);
      } else if (text) {
        try {
          buffer = await readFile(text);
        } catch (error) {
          await m.reply(`Could not read the image file at the provided path: ${text}`);
          return;
        }
      }

      await sock.updateProfilePicture(sock.user.id, buffer);
      await m.react('✅');
      await m.reply(`Profile picture updated successfully!`);

    } catch (error) {
      console.error("Error setting profile picture:", error);
      await m.react('❌');
      await m.reply(`Failed to update profile picture. Please try again later.`);
    }
  }
}

export default setProfilePicture;
