import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure you have this installed

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "repo") {
    await m.React('💖'); // Cute reaction!
    const repoUrl = 'https://github.com/Popkiddevs/POPKID-XTECH';
    const imageUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // ❗ REPLACE WITH YOUR ACTUAL IMAGE URL

    try {
      const apiUrl = `https://api.github.com/repos/Popkiddevs/POPKID-XTECH`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.forks_count !== undefined && data.stargazers_count !== undefined) {
        const stylishMessage = {
          image: { url: imageUrl },
          caption: `
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║                           💎💖 *𝐏 𝐎 𝐏 𝐊 𝐈 𝐃 - 𝐗 𝐌 𝐃* 💖💎                                           ║
╠════════════════════════════════════════════════════════════════════════════════════════════════╣
║         💫 **Welcome to the World of Innovation!** Explore the powerful features of XTECH! 💫       ║
╠════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                    ║
║ 🔗 **Repository**: \`${repoUrl}\`                                                                    ║
║ 🍓 **Forks**: \`${data.forks_count}\` ✨                                                              ║
║ 🌟 **Stars**: \`${data.stargazers_count}\` 🌈                                                         ║
║                                                                                                    ║
╠════════════════════════════════════════════════════════════════════════════════════════════════╣
║          💖 *Unlock, Collaborate, and Explore with POPKID XTECH! Join the Revolution* 💖              ║
╚════════════════════════════════════════════════════════════════════════════════════════════════╝
`.trim(),
        };

        sock.sendMessage(m.from, stylishMessage, { quoted: m });
      } else {
        sock.sendMessage(m.from, { text: 'Oops! We couldn’t fetch all the details. Please try again later. 🥺', quoted: m });
      }
    } catch (error) {
      console.error("Error fetching repo info:", error);
      sock.sendMessage(m.from, { text: '⚠️ Oh no! Something went wrong with fetching the repo details. 😢', quoted: m });
    } finally {
      await m.React('✅');
    }
  }
};

export default repo;
