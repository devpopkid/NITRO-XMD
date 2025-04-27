Import config from '../../config.cjs';
import ytsearch from 'yt-search';

const play = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "play") {
    if (!text) {
      return sock.sendMessage(m.from, { text: "🎶 Please tell me which song you'd like to hear, sweetie! ✨" }, { quoted: m });
    }

    const start = Date.now();
    await m.React('💫'); // A sparkling star for a magical feel

    try {
      const yt = await ytsearch(text);
      if (!yt.results.length) {
        await m.React('🥺'); // A pleading face for a touch of cuteness
        return sock.sendMessage(m.from, { text: "🌸 Aww, I couldn't find that song! Maybe try another one? 💕" }, { quoted: m });
      }

      const song = yt.results[0];
      const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data?.result?.downloadUrl) {
        await m.React('💔'); // A broken heart for disappointment
        return sock.sendMessage(m.from, { text: "🌷 Oh no! Something went wrong with the download. Let's try again later! 🎀" }, { quoted: m });
      }

      const end = Date.now();
      const responseTime = (end - start) / 1000;

      const musicNoteEmoji = '🎼'; // A fancier musical note
      const sparkleEmoji = '💖';   // A pink heart sparkle

      const title = `\n\n<==============================>\n🎧 Playing: ${song.title}\n<==============================>\n\n`;

      await sock.sendMessage(m.from, {
        audio: { url: data.result.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${song.title}.mp3`,
        caption: title,
        contextInfo: {
          externalAdReply: {
            title: `🎵 ${song.title.length > 20 ? `${song.title.substring(0, 17)}...` : song.title} 🌸`, // Added flower
            body: `${musicNoteEmoji} Enjoy the music, darling! ${sparkleEmoji} (${responseTime.toFixed(2)}s)`, // Sweet terms
            mediaType: 1,
            thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
            sourceUrl: 'https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l',
            mediaUrl: 'https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l',
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      await m.React('😊'); // A happy blushing face for success

    } catch (error) {
      console.error(error);
      await m.React('😫'); // A weary face for frustration
      sock.sendMessage(m.from, { text: "🎀 Oh dear! There was a little hiccup. Let's try playing your song again! ✨" }, { quoted: m });
    }
  }
};

export default play;
