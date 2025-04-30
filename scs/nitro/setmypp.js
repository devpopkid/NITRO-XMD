const setpp = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "setpp") {
    if (!m.quoted || !m.quoted.imageMessage) {
      return sock.sendMessage(m.from, { text: "❌ *Please reply to an image to set as your profile picture.*" }, { quoted: m });
    }

    await m.React('⏳');

    try {
      const media = await sock.downloadMediaMessage(m.quoted);
      await sock.updateProfilePicture(sock.user.id, media);
      await m.React('✅');
      await sock.sendMessage(m.from, { text: "*✅ Your profile picture has been updated.*" }, { quoted: m });
    } catch (err) {
      await m.React('❌');
      await sock.sendMessage(m.from, { text: "*❌ Failed to update profile picture.*" }, { quoted: m });
    }
  }
};

export default setpp;
