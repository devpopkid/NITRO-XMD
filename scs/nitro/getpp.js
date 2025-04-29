import config from '../../config.cjs';

const getProfilePicture = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "getpp" && m.quoted && m.quoted.sender) {
    try {
      const userId = m.quoted.sender;
      const ppUrl = await sock.profilePictureUrl(userId, 'image');
      const captionText = "Image fetched by POPKID xmd";

      if (ppUrl) {
        await sock.sendMessage(m.from, { image: { url: ppUrl }, caption: captionText }, { quoted: m.quoted });
      } else {
        await sock.sendMessage(m.from, { text: "Could not fetch profile picture or it's not available for this user." }, { quoted: m });
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      await sock.sendMessage(m.from, { text: "An error occurred while trying to fetch the profile picture." }, { quoted: m });
    }
  }
}

export default getProfilePicture;
