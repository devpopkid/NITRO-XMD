import axios from 'axios';
import config from '../../config.cjs'; // Assuming you have a config file

const tiktokdl = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const query = text; // Assuming the TikTok URL is provided after the command

  if (cmd === "tiktokdl" || cmd === "ttdl") {
    if (!query) {
      return sock.sendMessage(m.from, { text: "🔗 *Please provide a TikTok video URL.*" }, { quoted: m });
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const { data } = await axios.get(`https://api.davidcyriltech.my.id/download/tiktok?url=${query}`);

      if (!data.success || !data.result || !data.result.video) {
        return sock.sendMessage(m.from, { text: "⚠️ *Failed to fetch TikTok video. Please try again.*" }, { quoted: m });
      }

      const { desc, author, statistics, video, music } = data.result;

      const caption = `🎵 *TikTok Video Downloaded*\n\n💬 *Description:* ${desc}\n👤 *Author:* ${author.nickname} (@${author.unique_id})\n❤️ *Likes:* ${statistics.likeCount}\n💬 *Comments:* ${statistics.commentCount}\n🔄 *Shares:* ${statistics.shareCount}\n\n📥 *Powered by Popkid ✅*`;

      await sock.sendMessage(m.from, {
        video: { url: video },
        mimetype: "video/mp4",
        caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "YOUR_NEWSLETTER_JID@newsletter", // Replace with your actual newsletter JID
            newsletterName: "Your Newsletter Name",     // Replace with your actual newsletter name
            serverMessageId: 145, // You might need to adjust this
          },
        },
      }, { quoted: m });

      // Send the TikTok music separately
      if (music) {
        await sock.sendMessage(m.from, {
          audio: { url: music },
          mimetype: "audio/mpeg",
          fileName: `${author.unique_id}_${desc.substring(0, 10).replace(/\s+/g, '_') || 'tiktok'}.mp3`,
          caption: "🎶 *TikTok Audio Downloaded*",
        }, { quoted: m });
      }

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

    } catch (error) {
      console.error("TikTok Downloader Error:", error);
      sock.sendMessage(m.from, { text: "❌ *An error occurred while processing your TikTok video. Please ensure the URL is correct and try again later.*" }, { quoted: m });
    }
  }
};

export default tiktokdl;
