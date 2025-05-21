import config from '../../config.cjs';

const menu = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu2") {
    const start = new Date().getTime();
    await m.React('🪆');
    const end = new Date().getTime();
    const responseTime = ((end - start) / 1000).toFixed(2);
    const uptime = Math.floor(process.uptime());

    let profilePictureUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // Default fallback
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) profilePictureUrl = pp;
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
    }

    const menuText = `
╭━━━[ *𝗣𝗢𝗣𝗞𝗜𝗗 𝗠𝗗 𝗕𝗢𝗧* ]━━━╮
┃ 🧠 *Version:* 7.1.0
┃ 👤 *Developer:* POPKID 🪆
┃ ⚡ *Ultra Speed Engine*
╰━━━━━━━━━━━━━━━━━━━━╯

┏━[ ✨ *MAIN MENU* ✨ ]━┓
┃ ${prefix}menu       » Show menu
┃ ${prefix}alive      » Bot status
┃ ${prefix}owner      » Contact owner
┗━━━━━━━━━━━━━━━━━━━━┛

┏━[ 👑 *OWNER COMMANDS* ]━┓
┃ ${prefix}join           » Join group
┃ ${prefix}leave          » Leave group
┃ ${prefix}autobio        » Auto bio update
┃ ${prefix}block          » Block user
┃ ${prefix}unblock        » Unblock user
┃ ${prefix}autolikestatus » Auto-like status
┃ ${prefix}setppbot       » Change bot profile pic
┃ ${prefix}anticall       » Auto block on call
┃ ${prefix}setstatus      » Set bot status
┃ ${prefix}setnamebot     » Set bot name
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━[ 🤖 *GPT & AI MENU* ]━┓
┃ ${prefix}ai         » Chat with AI
┃ ${prefix}gpt        » OpenAI GPT
┃ ${prefix}dalle      » AI Image Gen
┃ ${prefix}bug        » Report bug
┃ ${prefix}report     » Submit feedback
┃ ${prefix}chatbot    » Enable chatbot
┗━━━━━━━━━━━━━━━━━━━━┛

┏━[ 🧰 *CONVERTER TOOLS* ]━┓
┃ ${prefix}attp       » Text to sticker
┃ ${prefix}gimage     » Google image
┃ ${prefix}play       » Download audio
┃ ${prefix}video      » Download video
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━[ 🔍 *SEARCH FUNCTIONS* ]━┓
┃ ${prefix}google     » Google search
┃ ${prefix}mediafire  » MediaFire files
┃ ${prefix}facebook   » FB video DL
┃ ${prefix}instagram  » Insta media DL
┃ ${prefix}tiktok     » TikTok video DL
┃ ${prefix}lyrics     » Song lyrics
┃ ${prefix}imdb       » Movie info
┗━━━━━━━━━━━━━━━━━━━━━━━┛

┏━[ 🎉 *FUN & MISC* ]━┓
┃ ${prefix}getpp      » Get profile picture
┃ ${prefix}url        » Media to URL
┗━━━━━━━━━━━━━━━━━━━━┛

╭━[ ⚙️ *INFO* ]━╮
┃ ⏱️ *Ping:* ${responseTime}s
┃ 📆 *Uptime:* ${uptime}s
╰━━━━━━━━━━━━━━╯

📌 _More features coming soon..._
📢 _Bot by POPKID 🪆_
`.trim();

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText,
      buttons: [
        { buttonId: `${prefix}owner`, buttonText: { displayText: '👑 Owner' }, type: 1 },
        { buttonId: `${prefix}alive`, buttonText: { displayText: '🟢 Alive' }, type: 1 },
        { buttonId: `${prefix}ai`, buttonText: { displayText: '🤖 Chat with AI' }, type: 1 },
      ],
      footer: 'Powered by POPKID 🪆 | Version 7.1.0',
      headerType: 4,
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

export default menu;
