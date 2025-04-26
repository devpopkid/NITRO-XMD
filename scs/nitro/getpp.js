const getpp = async (m, sock) => {
  const { quoted, sender, pushName } = m;
  const mentionedUser = quoted ? quoted.sender : sender;
  const senderName = pushName;

  if (!mentionedUser) {
    return await m.reply(`📸 Who's profile pic do you want, ${senderName}? Tag someone!`);
  }

  const targetUserId = mentionedUser;

  const start = new Date().getTime();
  await m.react('⏳'); // Indicate loading

  try {
    const ppuser = await sock.profilePictureUrl(targetUserId, 'image').catch(() => null);
    const end = new Date().getTime();
    const responseTime = (end - start);

    if (ppuser) {
      await sock.sendMessage(
        m.from,
        {
          image: { url: ppuser },
          caption: `🖼️ Got @${targetUserId.split('@')[0]}'s pic in ${responseTime}ms!\nPowered by popkid xmd`,
          mentions: [targetUserId],
        },
        { quoted: m }
      );
    } else {
      await sock.sendMessage(
        m.from,
        {
          text: `🔒 Couldn't get @${targetUserId.split('@')[0]}'s pic (private?). Took ${responseTime}ms.\nUsing default.`,
          mentions: [targetUserId],
        },
        { quoted: m }
      );
      // Optionally send a default picture here:
      // await sock.sendMessage(m.from, { image: { url: 'URL_TO_DEFAULT_PIC' } }, { quoted: m });
    }
  } catch (error) {
    const end = new Date().getTime();
    const responseTime = (end - start);
    console.error("Error in getpp command:", error);
    await sock.sendMessage(
      m.from,
      {
        text: `⚠️ Failed to get @${targetUserId.split('@')[0]}'s pic in ${responseTime}ms! Error: ${error.message}`,
        mentions: [targetUserId],
      },
      { quoted: m }
    );
  }
};

export default getpp;
