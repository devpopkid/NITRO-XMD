import config from '../../config.cjs';
import fetch from 'node-fetch';

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "repo") {
    if (!config.REPO_LINK) {
      await m.reply("Repository link is not configured.");
      return;
    }

    const repoParts = config.REPO_LINK.split('/').slice(-2);
    if (repoParts.length !== 2) {
      await m.reply("Invalid repository link format.");
      return;
    }
    const [owner, repoName] = repoParts;
    const apiUrl = `https://api.github.com/repos/Popkiddevs/POPKID-XTECH`;

    await m.React('⏳');

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.stargazers_count !== undefined && data.forks_count !== undefined) {
        const stars = data.stargazers_count;
        const forks = data.forks_count;
        let message = `╔═══════< 🌟 >════════╗\n`;
        message += `║ ✨ **${repoName} Repository** ✨ ║\n`;
        message += `╠═══════════════════════╣\n`;
        message += `║ 🔗 **Link:** ${config.REPO_LINK} ║\n`;
        message += `║ ⭐ **Stars:** ${stars.toString().padEnd(19)} ║\n`; // Pad for alignment
        message += `║ 🍴 **Forks:** ${forks.toString().padEnd(19)} ║\n`; // Pad for alignment
        if (config.NEWSLETTER_CHANNEL_ID) {
          message += `║ 📢 Newsletter: <#${config.NEWSLETTER_CHANNEL_ID}> ║\n`;
        }
        message += `╚═══════════════════════╝\n`;
        message += `  _Fetched on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' })} EAT_`;

        const imageOptions = config.REPO_IMAGE_URL ? { image: { url: config.REPO_IMAGE_URL } } : {};

        await sock.sendMessage(m.from, { text: message, ...imageOptions }, { quoted: m });
        await m.React('✅');
      } else {
        await m.reply("Could not fetch star and fork counts.");
        await m.React('⚠️');
      }
    } catch (error) {
      console.error("Error fetching repository info:", error);
      await m.reply("An error occurred while fetching repository information.");
      await m.React('❌');
    }
  }
}

export default repo;
