import config from '../../config.cjs';

const setppgroup = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "setgpp") {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.from, { text: "❌ *This command can only be used in groups.*" }, { quoted: m });
    }

    if (!m.quoted || !m.quoted.imageMessage) {
      return sock.sendMessage(m.from, { text: "❌ *Please reply to an image to set as group profile picture.*" }, { quoted: m });
    }

    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;

      if (!botAdmin) {
        await m.React('❌');
        return sock.sendMessage(m.from, { text: "❌ *I need to be an admin to change the group profile picture.*" }, { quoted: m });
      }

      const media = await sock.downloadMediaMessage(m.quoted);
      await sock.updateProfilePicture(m.from, media);
      await m.React('✅');
      await sock.sendMessage(m.from, { text: "*✅ Group profile picture updated.*" }, { quoted: m });

    } catch (err) {
      console.error("Group profile pic update error:", err);
      await m.React('❌');
      await sock.sendMessage(m.from, { text: "*❌ Failed to update group profile picture.*" }, { quoted: m });
    }
  }
};

export default setppgroup;
