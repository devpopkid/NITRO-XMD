import config from '../../config.cjs';
import fetch from 'node-fetch';
import ytsearch from 'yt-search';

const play = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const q = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "play") {
    try {
      if (!q) return sock.sendMessage(m.from, { text: "*❌ Please provide a song name or YouTube link.*" }, { quoted: m });

      await sock.sendMessage(m.from, { text: "_🔎 Searching for your song..._" }, { quoted: m });

      const yt = await ytsearch(q);
      if (!yt.results.length) return sock.sendMessage(m.from, { text: "*❌ No results found!*" }, { quoted: m });

      const song = yt.results[0];
      const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

      await sock.sendMessage(m.from, { text: "_🎶 Fetching the music file, please wait..._" }, { quoted: m });

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data?.result?.downloadUrl) return sock.sendMessage(m.from, { text: "*❌ Download failed. Try again later.*" }, { quoted: m });

      const songInfo = `╭───〔 *SONG INFO* 〕───╮
│ 🎵 *Title:* ${song.title}
│ ⏳ *Duration:* ${song.timestamp}
│ 📅 *Published:* ${song.ago}
│ 🔗 *Link:* ${song.url}
╰────────────────────╯`;

      await sock.sendMessage(m.from, {
        text: songInfo,
      }, { quoted: m });

      await sock.sendMessage(m.from, {
        audio: { url: data.result.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${song.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
            body: "Tap to join our WhatsApp Channel!",
            mediaType: 1,
            thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
            sourceUrl: 'https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j',
            mediaUrl: 'https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j',
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

    } catch (error) {
      console.error(error);
      sock.sendMessage(m.from, { text: "*❌ An error occurred. Please try again later.*" }, { quoted: m });
    }
  }
}

export default play;
