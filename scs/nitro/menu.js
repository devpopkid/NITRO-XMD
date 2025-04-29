import config from '../../config.cjs';

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('🪆');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    const menuText = `
╭━━━━━━━❀━✧✧✧━❀━━━━━━━╮
🌟  *𝗣𝗢𝗣𝗞𝗜𝗗 𝗠𝗗 𝗕𝗢𝗧* 🌟
*Version*: 7.1.0 | 
*DEVELOPED BY POPKID🪆*
> ULTRA SPEED ⚡ ⚡ 
╰━━━━━━━❀━✧✧✧━❀━━━━━━━╯

✨ *𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗠𝗘𝗡𝗨* ✨
> *Explore the commands below to harness the bot's full power!*

╭━━━━━🍃━━━━━╮
🌍  *𝗦𝗬𝗦𝗧𝗘𝗠 𝗠𝗘𝗡𝗨* 🌍
| ⚡ | ${prefix}𝙿𝚒𝚗𝚐
| 🟢 | ${prefix}𝙰𝚕𝚒𝚟𝚎
| 🛠️ | ${prefix}𝙾𝚠𝚗𝚎𝚛
| 🍔 | ${prefix}𝙼𝚎𝚗𝚞
╰━━━━━🍃━━━━━╯

╭━━━━━🍀━━━━━╮
👑  *𝗢𝗪𝗡𝗘𝗥 𝗣𝗔𝗚𝗘* 👑
| 🎮 | ${prefix}𝙹𝚘𝚒𝚗
| 🚪 | ${prefix}𝙻𝚎𝚊𝚟𝚎
| 🩷 | ${prefix}𝙰𝚞𝚝𝚘𝚋𝚒𝚘
| 🔒 | ${prefix}𝙱𝚕𝚘𝚌𝚔 
| 🔓 | ${prefix}𝚄𝚗𝚋𝚕𝚘𝚌𝚔
| 🤖 | ${prefix}𝚂𝚎𝚝𝚙𝚙𝚋𝚘𝚝
| 🚫 | ${prefix}𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕
| 🛑 | ${prefix}𝚂𝚎𝚝𝚜𝚝𝚊𝚝𝚞𝚜
| 📝 | ${prefix}𝚂𝚎𝚝𝚗𝚊𝚖𝚎𝚋𝚘𝚝
╰━━━━━🍀━━━━━╯

╭━━━━━🌟━━━━━╮
🤖  *𝗚𝗣𝗧 𝗠𝗘𝗡𝗨* 🤖
| 💬 | ${prefix}𝙰𝚒
| 🐞 | ${prefix}𝙱𝚞𝚐
| 📝 | ${prefix}𝚁𝚎𝚙𝚘𝚛𝚝
| 🚪 | ${prefix}𝙲𝚑𝚊𝚝𝚋𝚘𝚝
| 🧠 | ${prefix}𝙶𝚙𝚝
| 🎨 | ${prefix}𝙳𝚊𝚕𝚕𝚎
╰━━━━━🌟━━━━━╯

╭━━━━━🍃━━━━━╮
📦  *𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥 𝗣𝗔𝗚𝗘* 📦
| 🎶 | ${prefix}𝙰𝚃𝚃𝙿
| 🎬 | ${prefix}𝙶𝚒𝚖𝚊𝚐𝚎
| 🎧 | ${prefix}𝙿𝚕𝚊𝚢
| 📹 | ${prefix}𝚅𝚒𝚍𝚎𝚘
╰━━━━━🍃━━━━━╯

╭━━━━━🌸━━━━━╮
🔍  *𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨* 🔍
| 🔎 | ${prefix}𝙶𝚘𝚘𝚐𝚕𝚎
| 📽️ | ${prefix}𝙼𝚎𝚍𝚒𝚊𝚏𝚒𝚛𝚎
| 🚪 | ${prefix}𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔
| 🚪 | ${prefix}𝙸𝚐𝚍𝚕
| 🚪 | ${prefix}𝚃𝚒𝚔𝚝𝚘𝚔
| 🎶 | ${prefix}𝙻𝚢𝚛𝚒𝚌𝚜
| 🎬 | ${prefix}𝙸𝚖𝚍𝚋
╰━━━━━🌸━━━━━╯

🔧 *Wᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴇɴᴜ!*
*ᴡᴀɪᴛ ғᴏʀ ᴍᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅs...*

📢 *ᴅᴇᴠ ᴘᴏᴘᴋɪᴅ*

`;

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/kiy0hl.jpg' },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "ᴘᴏᴘᴋɪᴅ xᴍᴅ ʙᴏᴛ",
          newsletterJid: "120363290715861418@newsletter",
        },
      }
    }, { quoted: m });
  }
};

export default ping;
