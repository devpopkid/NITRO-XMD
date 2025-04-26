import axios from 'axios';
import config from '../../config.cjs'; // Assuming your prefix is in config

const instagramDownload = async (Matrix, m) => {
  if (!m.body || m.isBaileys || m.key.fromMe) return;

  const prefix = config.PREFIX;
  const [command, ...args] = m.body.trim().substring(prefix.length).split(/\s+/);
  const query = args.join(' '); // For commands that take arguments

  switch (command?.toLowerCase()) {
    case 'igdl': // Or any command you want to use for Instagram download
    case 'instagramdl':
    case 'instadl':
      if (query) {
        await Matrix.sendMessage(m.from, { react: { text: "⏳", key: m.key } });
        const start = Date.now();

        try {
          const { data } = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${query}`);
          const apiEndTime = Date.now();
          const apiResponseTime = (apiEndTime - start) / 1000;

          if (!data.success || !data.downloadUrl) {
            await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
            return Matrix.sendMessage(m.from, {
              text: `⚠️ *Download Failed!* ⏱️ ${apiResponseTime.toFixed(2)}s (API)\n\nCould not fetch Instagram video. Please ensure the link is valid and try again.`,
              quoted: m,
            });
          }

          const uploadStart = Date.now();
          await Matrix.sendMessage(
            m.from,
            {
              video: { url: data.downloadUrl },
              mimetype: "video/mp4",
              caption: `📥 *Download Complete!* ⏱️ ${(
                (Date.now() - uploadStart) /
                1000
              ).toFixed(2)}s (Upload)\n\n✨ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ xᴛᴇᴄʜ ✅*`,
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363290715861418@newsletter",
                  newsletterName: "ᴘᴏᴘᴋɪᴅ xᴍᴅ",
                  serverMessageId: 143,
                },
              },
            },
            { quoted: m }
          );

          const end = Date.now();
          const totalResponseTime = (end - start) / 1000;
          await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
          await Matrix.sendMessage(
            m.from,
            {
              text: `*Download Success!* 🚀 Total: ${totalResponseTime.toFixed(
                2
              )}s\n\nEnjoy your video! 😉`,
              quoted: m,
            },
            { disappearingMessagesInSeconds: 30 }
          );
        } catch (error) {
          console.error("Instagram Downloader Error:", error);
          await Matrix.sendMessage(m.from, { react: { text: "❗", key: m.key } });
          Matrix.sendMessage(
            m.from,
            {
              text: `❌ *Oops! An error occurred.* ⏱️ ${(
                (Date.now() - start) /
                1000
              ).toFixed(2)}s\n\nSomething went wrong while trying to download the video. Please try again later.`,
              quoted: m,
            },
            { disappearingMessagesInSeconds: 30 }
          );
        }
      } else {
        await Matrix.sendMessage(m.from, { text: `Please provide an Instagram video URL.\n\nExample: ${prefix}igdl https://www.instagram.com/reel/...` }, { quoted: m });
      }
      break;
    default:
      // If it's not the Instagram download command, you might have other commands or do nothing
      break;
  }
};

export default instagramDownload;
