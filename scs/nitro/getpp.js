import config from '../../config.cjs';

const profile = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "getpp") {
    if (!text) {
      return m.reply(`Please provide a WhatsApp number to fetch the profile picture.\nExample: ${prefix}profile 2547xxxxxxxx`);
    }

    const jid = text.startsWith('254') ? `${text}@s.whatsapp.net` : `${text}@s.whatsapp.net`; // Assuming Kenyan numbers start with 254, adjust as needed

    try {
      const ppUrl = await sock.profilePictureUrl(jid, 'image');
      if (ppUrl) {
        await sock.sendMessage(m.from, { image: { url: ppUrl }, caption: `Profile picture of ${text}` }, { quoted: m });
      } else {
        await m.reply(`Could not fetch the profile picture for ${text} or the user has no profile picture.`);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      await m.reply(`An error occurred while trying to fetch the profile picture for ${text}. Please ensure the number is valid.`);
    }
  }
}

export default profile;
