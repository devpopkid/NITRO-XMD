import config from '../../config.cjs';
import { stylishText } from './utils.js'; // Assuming you have a utils.js with stylishText function

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('🪆');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    let profilePictureUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // Default image URL
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) {
        profilePictureUrl = pp;
      }
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
      // Use the default image if fetching fails
    }

    const botNameStyled = stylishText('*𝗣𝗢𝗣𝗞𝗜𝗗 𝗠𝗗 𝗕𝗢𝗧*');
    const versionStyled = stylishText('*Version*:');
    const developedByStyled = stylishText('*DEVELOPED BY POPKID🪆*');
    const speedStyled = stylishText('*ULTRA SPEED ⚡ ⚡*');
    const commandsMenuStyled = stylishText('_✨ *𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗠𝗘𝗡𝗨* ✨_');
    const exploreCommandsStyled = stylishText('*Explore the commands below to harness the bot\'s full power!*');
    const systemMenuStyled = stylishText('🌍  *𝗦𝗬𝗦𝗧𝗘𝗠 𝗠𝗘𝗡𝗨* 🌍');
    const ownerPageStyled = stylishText('👑  *𝗢𝗪𝗡𝗘𝗥 𝗣𝗔𝗚𝗘* 👑');
    const gptMenuStyled = stylishText('🤖  *𝗚𝗣𝗧 𝗠𝗘𝗡𝗨* 🤖');
    const converterPageStyled = stylishText('📦  *𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥 𝗣𝗔𝗚𝗘* 📦');
    const searchMenuStyled = stylishText('🔍  *𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨* 🔍');
    const welcomeStyled = stylishText('*Wᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴇɴᴜ!*');
    const waitStyled = stylishText('*ᴡᴀɪᴛ ғᴏʀ ᴍᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅs...*');
    const devStyled = stylishText('📢 *ᴅᴇᴠ ᴘᴏᴘᴋɪᴅ*');

    const menuText = `
━━━━━━━━━━━━━━━━━━━
> 🌟  ${botNameStyled} 🌟
> ${versionStyled}: 7.1.0 |
> ${developedByStyled}
> ${speedStyled}
━━━━━━━━━━━━━━━━━━━

${commandsMenuStyled}
> ${exploreCommandsStyled}

━━━━━━━━━━━━━━━━━━━
             ${systemMenuStyled}
━━━━━━━━━━━━━━━━━━━
| ⚡ | ${prefix}menu
| 🟢 | ${prefix}alive
| 🛠️ | ${prefix}owner
| 🍔 | ${prefix}menu
━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━
             ${ownerPageStyled}
━━━━━━━━━━━━━━━━━━━
| 🎮 | ${prefix}join
| 🚪 | ${prefix}leave
| 🩷 | ${prefix}autobio
| 🔒 | ${prefix}block
| 🧋 | ${prefix}autolikestatus
| 🔓 | ${prefix}unblock
| 🤖 | ${prefix}setppbot
| 🚫 | ${prefix}anticall
| 🛑 | ${prefix}setstatus
| 📝 | ${prefix}setnamebot
━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━
                ${gptMenuStyled}
━━━━━━━━━━━━━━━━━━━
| 💬 | ${prefix}ai
| 🐞 | ${prefix}bug
| 📝 | ${prefix}report
| 🚪 | ${prefix}chatbot
| 🧠 | ${prefix}gpt
| 🎨 | ${prefix}dalle
━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━
           ${converterPageStyled}
━━━━━━━━━━━━━━━━━━━
| 🎶 | ${prefix}attp
| 🎬 | ${prefix}gimage
| 🎧 | ${prefix}play
| 📹 | ${prefix}video
━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━
            ${searchMenuStyled}
━━━━━━━━━━━━━━━━━━━
| 🔎 | ${prefix}google
| 📽️ | ${prefix}mediafire
| 🚪 | ${prefix}facebook
| ❤️ | ${prefix}instagram
| 🚪 | ${prefix}tiktok
| 🎶 | ${prefix}lyrics
| 🎬 | ${prefix}imdb
━━━━━━━━━━━━━━━━━━━

${welcomeStyled}
${waitStyled}

${devStyled}

`;

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363290715861418@newsletter",
        },
      }
    }, { quoted: m });
  }
};

// Assume you have a utils.js file like this:
/*
export const stylishText = (text) => {
  // You can implement different stylish text transformations here
  // For example, using unicode characters for bold, italic, etc.
  const boldChars = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠',
    'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺',
    'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
    '*': '*', '_': '_', '~': '~', ' ': ' '
  };
  let styled = '';
  for (const char of text) {
    styled += boldChars[char] || char;
  }
  return styled;
};
*/

export default menu;
