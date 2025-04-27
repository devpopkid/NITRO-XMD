import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure you have this installed

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "repo") {
    await m.React('⏳');
    const repoUrl = 'https://github.com/Popkiddevs/POPKID-XTECH';
    const imageUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // ❗ REPLACE WITH YOUR ACTUAL IMAGE URL

    try {
      const apiUrl = `https://api.github.com/repos/Popkiddevs/POPKID-XTECH`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.forks_count !== undefined) {
        const stylishMessage = {
          image: { url: imageUrl },
          caption: `
╔═════ 🤖  ═════╗
  ✨ *P O P K I D - X T E C H* ✨
╚═══════════════════╝

🔗 **Repository:**
   \`${repoUrl}\`

 **Forks:**
   \`${data.forks_count}\`

💖 *ᴇxᴘʟᴏʀᴇ ᴛʜᴇ ᴘᴏᴡᴇʀ ᴏғ ᴘᴏᴘᴋɪᴅ xᴍᴅ!* 💖
          `.trim(),
        };
        sock.sendMessage(m.from, stylishMessage, { quoted: m });
      } else {
        sock.sendMessage(m.from, { text: 'Hmm, unable to retrieve repository details. 🤔', quoted: m });
      }
    } catch (error) {
      console.error("Error fetching repo info:", error);
      sock.sendMessage(m.from, { text: '⚠️ An error occurred while fetching repository info. 😥', quoted: m });
    } finally {
      await m.React('✅');
    }
  }
};

export default repo;
