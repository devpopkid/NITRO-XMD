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

    const headerText = `
    ╭━━━━━━━━━━━━━⊷💫 *𝗣𝗢𝗣𝗞𝗜𝗗-𝗠𝗗 𝗕𝗢𝗧* 💫⊷━━━━━━━━━━━━━
    ┃ 🔷 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: *7.1.0*
    ┃ 🌟 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥: *𝗣𝗢𝗣-𝗞𝗜𝗗*
    ┃ 📱 𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬: *𝚙𝚘𝚙𝚔𝚒𝚍@discord*
    ┃ 🔔 𝗣𝗨𝗧𝗧𝗜𝗡𝗚 𝗕𝗢𝗧 𝗧𝗢 𝗨𝗦𝗘: *𝙱𝙾𝚃 𝙻𝙸𝙵𝙴*
    ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ⚙️ *𝗕𝗢𝗧 𝗜𝗡𝗙𝗢:*
    ✔️ 𝙰𝙸 𝗣𝗢𝗪𝗘𝗥𝗘𝗗
    ✔️ 𝗙𝗨𝗟𝗟𝗬 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗗
    ✔️ 𝗦𝗧𝗔𝗕𝗟𝗘 𝗩𝗘𝗥𝗦𝗜𝗢𝗡
    ✔️ 𝗨𝗦𝗘𝗥-𝗙𝗥𝗜𝗘𝗡𝗗𝗟𝗬

    ╭━━━━━━━━━━━━━⊷ 𝗖𝗨𝗦𝗧𝗢𝗠 𝗛𝗘𝗔𝗗𝗘𝗥 ⊷━━━━━━━━━━━━━
    ┃ 📝 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦: Type *${prefix}menu* to see commands.
    ┃ 🕒 𝗥𝗘𝗔𝗟𝗧𝗜𝗠𝗘 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘: *${responseTime}s*
    ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const menuText = `
    ╭─────═━┈┈━═──━┈⊷   🪆 *𝗣𝗢𝗣𝗞𝗜𝗗-𝗠𝗗 𝗠𝗘𝗡𝗨* 🪆   ⊷  ╭─────═━┈┈━═──━┈
    ┇ ʙᴏᴛ ɴᴀᴍᴇ: *𝗣𝗢𝗣𝗞𝗜𝗗-𝗠𝗗* ┇ ᴠᴇʀꜱɪᴏɴ: *7.1.0* ┇ ᴅᴇᴠ: *𝗣𝗢𝗣-𝗞𝗜𝗗* 
    ╰─────═━┈┈━═──━┈⊷

    *𝗣𝗢𝗣𝗞𝗜𝗗 𝗠𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦*
    *This commands will guide* *you how to use me*

    ━━━━━🪆━━━━━━ ❏   *sʏsᴛᴇᴍ ᴍᴇɴᴜ* ❏ | ❍ |${prefix}𝙿𝚒𝚗𝚐 | ❍ |${prefix}𝙰𝚕𝚒𝚟𝚎 | ❍ |${prefix}𝙾𝚠𝚗𝚎𝚛 | ❍ |${prefix}𝙼𝚎𝚗𝚞 ━━━━━🪆━━━━━━

    ━━━━━🪆━━━━━━ ❏   *ᴏᴡɴᴇʀ ᴘᴀɢᴇ* ❏ | ❍ |${prefix}𝙹𝚘𝚒𝚗 | ❍ |${prefix}𝙻𝚎𝚊𝚟𝚎 | ❍ |${prefix}𝙱𝚕𝚘𝚌𝚔 | ❍ |${prefix}𝚄𝚗𝚋𝚕𝚘𝚌𝚔 | ❍ |${prefix}𝚂𝚎𝚝𝚙𝚙𝚋𝚘𝚝 | ❍ |${prefix}𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕 | ❍ |${prefix}𝚂𝚎𝚝𝚜𝚝𝚊𝚝𝚞𝚜 | ❍ |${prefix}𝚂𝚎𝚝𝚗𝚊𝚖𝚎𝚋𝚘𝚝 ━━━━━🪆━━━━━━

    ━━━━━🪆━━━━━━ ❏   *ɢᴘᴛ ᴍᴇɴᴜ* ❏ | ❍ |${prefix}𝙰𝚒 | ❍ |${prefix}𝙱𝚞𝚐 | ❍ |${prefix}𝚁𝚎𝚙𝚘𝚛𝚝 | ❍ |${prefix}𝙶𝚙𝚝 | ❍ |${prefix}𝙳𝚊𝚕𝚕𝚎 | ❍ |${prefix}𝚁𝚎𝚖𝚒𝚗𝚒 | ❍ |${prefix}𝙶𝚎𝚖𝚒𝚗𝚒 ━━━━━🪆━━━━━━

    ━━━━━🪆━━━━━━ ❏  *ᴄᴏɴᴠᴇʀᴛᴇʀ ᴘᴀɢᴇ* ❏ | ❍ |${prefix}𝙰𝚃𝚃𝙿 | ❍ |${prefix}𝙰𝚃𝚃𝙿2 | ❍ |${prefix}𝙰𝚃𝚃𝙿3 | ❍ |${prefix}𝙴𝙱𝙸𝙽𝙰𝚁𝚈 | ❍ |${prefix}𝙳𝙱𝙸𝙽𝙰𝚁𝚈 | ❍ |${prefix}𝙴𝙼𝙾𝙹𝙸𝙼𝙸𝚇 | ❍ |${prefix}𝙼𝙿3 ━━━━━🪆━━━━━━

    ━━━━━🪆━━━━━━ ❏  *ɢʀᴏᴜᴘ ᴘᴀɢᴇ* ❏ | ❍ |${prefix}𝙻𝚒𝚗𝚔𝙶𝚛𝚘𝚞𝚙 | ❍ |${prefix}𝚂𝚎𝚝𝚙𝚙𝚐𝚌 | ❍ |${prefix}𝚂𝚎𝚝𝚗𝚊𝚖𝚎 | ❍ |${prefix}𝚂𝚎𝚝𝚍𝚎𝚜𝚌 | ❍ |${prefix}𝙶𝚛𝚘𝚞𝚙 | ❍ |${prefix}𝙶𝚌𝚜𝚎𝚝𝚝𝚒𝚗𝚐 | ❍ |${prefix}𝚆𝚎𝚕𝚌𝚘𝚖𝚎 | ❍ |${prefix}𝙰𝚍𝚍 | ❍ |${prefix}𝙺𝚒𝚌𝚔 | ❍ |${prefix}𝙷𝚒𝚍𝚎𝚃𝚊𝚐 | ❍ |${prefix}𝚃𝚊𝚐𝚊𝚕𝚕 | ❍ |${prefix}𝙰𝚗𝚝𝚒𝙻𝚒𝚗𝚔 | ❍ |${prefix}𝙰𝚗𝚝𝚒𝚃𝚘𝚡𝚒𝚌 | ❍ |${prefix}𝙿𝚛𝚘𝚖𝚘𝚝𝚎 | ❍ |${prefix}𝙳𝚎𝚖𝚘𝚝𝚎 | ❍ |${prefix}𝙶𝚎𝚝𝚋𝚒𝚘 ━━━━━🪆━━━━━━

    ━━━━━🪆━━━━━━ ❏ *ᴅᴏᴡɴʟᴏᴀᴅ ғᴏʟᴅᴇʀ* ❏ | ❍ |${prefix}𝙰𝚙𝚔 | ❍ |${prefix}𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚚 | ❍ |${prefix}𝙼𝚎𝚍𝚒𝚊𝚏𝚒𝚎 | ❍ |${prefix}𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝𝚍𝚕 | ❍ |${prefix}𝙶𝚒𝚝𝚌𝚕𝚘𝚗𝚎 | ❍ |${prefix}𝙶𝚍𝚛𝚒𝚟𝚎 | ❍ |${prefix}𝙸𝚗𝚜𝚝𝚊 | ❍ |${prefix}𝚈𝚝𝚖𝚙3 | ❍ |${prefix}𝚈𝚝𝚖𝚙4 | ❍ |${prefix}𝙿𝚕𝚊𝚢 | ❍ |${prefix}𝚂𝚘𝚗𝚐 | ❍ |${prefix}𝚅𝚒𝚍𝚎𝚘 | ❍ |${prefix}𝚈𝚝𝚖𝚙3𝚍𝚘𝚌 | ❍ |${prefix}𝚈𝚝𝚖𝚙4𝚍𝚘𝚌 | ❍ |${prefix}𝚃𝚒𝚔𝚝𝚘𝚔 ━━━━━🪆━━━━━━

    ━━━━━🪆━━━━━━ ❏ *sᴇᴀʀᴄʜ ᴍᴇɴᴜ* ❏ | ❍ |${prefix}𝙿𝚕𝚊𝚢 | ❍ |${prefix}𝚈𝚝𝚜 | ❍ |${prefix}𝙸𝚖𝚍𝚋 | ❍ |${prefix}𝙶𝚘𝚘𝚐𝚕𝚎 | ❍ |${prefix}𝙶𝚒𝚖𝚊𝚐𝚎 | ❍ |${prefix}𝙻𝚢𝚛𝚒𝚌𝚜 ━━━━━🪆━━━━━━

    *ᴡᴀɪᴛ ғᴏʀ ᴍᴏʀᴇ* *ᴅᴇᴠ ᴘᴏᴘᴋɪᴅ* ━━━━━🪆━━━━━━
    `;

    // Send the header and menu
    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/kiy0hl.jpg' },
      caption: `${headerText.trim()}\n\n${menuText.trim()}`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "ᴘᴏᴘᴋɪᴅ xᴍᴅ ʙᴏᴛ",
          newsletterJid: "120363290715861418@newsletter",
        },
      },
    }, { quoted: m });
  }
};

export default ping;
