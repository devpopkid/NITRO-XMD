/*import config from '../../config.cjs';
import fetch from 'node-fetch';

async function fetchJson(url, options = {}) {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

// Fancy loading bar function (remains the same)
const createLoadingBar = (progress) => {
    const barLength = 20;
    const filledLength = Math.round(barLength * progress);
    const emptyLength = barLength - filledLength;
    const filledBar = '█'.repeat(filledLength);
    const emptyBar = '░'.repeat(emptyLength);
    return `[${filledBar}${emptyBar}] ${Math.round(progress * 100)}%`;
};

// Function to format numbers with commas
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const play = async (m, sock) => {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === "play") {
        if (!text) {
            return m.reply("🎶 Please provide a song name to play! 🎶");
        }

        try {
            await sock.sendMessage(m.from, { text: `🎧 Searching for "${text}"...\n${createLoadingBar(0.1)}` }, { quoted: m });

            let kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
            let songData = kyuu.data[0];

            if (!songData) {
                return m.reply("😥 Song not found. Please try another search! 😥");
            }

            await sock.sendMessage(m.from, { text: `🎼 Found it!\n${createLoadingBar(0.5)}` }, { quoted: m });

            // --- Fancy Box Start ---
            const songInfoBox = `╔═════════< POPKID XMD >═════════╗
║ 🎶 *Title:* ${songData.title}
║ 👀 *Views:* ${songData.views ? formatNumber(songData.views) : 'N/A'}
║ 🗓️ *Released:* ${songData.uploadDate || 'N/A'}
╚═══════════════════════════════╝`;
            // --- Fancy Box End ---

            // Send initial "Playing" message with context info and large thumbnail
            await sock.sendMessage(m.from, {
                text: songInfoBox + `\n\n🎶 *Now Playing:* 🎧 *${songData.title}* 🎧`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "✨ ᴘᴏᴘᴋɪᴅ xᴍᴅ ✨", // Fancy bot name
                        newsletterJid: "120363290715861418@newsletter",
                    },
                    externalAdReply: {
                        title: "🎵 Ultimate Music Experience 🎵",
                        body: `Playing: ${songData.title}`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        sourceUrl: global.link || 'https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

            await sock.sendMessage(m.from, { text: `⏳ Getting the audio...\n${createLoadingBar(0.8)}` }, { quoted: m });

            // Fetch audio URL
            let tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
            let audioUrl = tylor.result.audio;

            if (!audioUrl) {
                return m.reply("⚠️ Unable to fetch audio. Please try again. ⚠️");
            }

            // Send the audio file with context info and large thumbnail
            await sock.sendMessage(m.from, {
                audio: { url: audioUrl },
                fileName: `${songData.title}.mp3`,
                mimetype: "audio/mpeg",
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "✨ ᴘᴏᴘᴋɪᴅ xᴍᴅ ✨", // Fancy bot name
                        newsletterJid: "120363290715861418@newsletter",
                    },
                    externalAdReply: {
                        title: `🎧 ${songData.title} - Now Playing! 🎧`,
                        body: `.mp3 audio`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

            await sock.sendMessage(m.from, { text: `✅ Enjoy the music! ✅\n${createLoadingBar(1)}` }, { quoted: m });

        } catch (error) {
            console.error("Error in play command:", error);
            m.reply("❗ An error occurred while processing your request. Please try again later. ❗");
        }
    }
}

export default play;*/

import config from '../../config.cjs';
import ytsearch from 'yt-search'; // Assuming you have this library
import { formatNumber } from '../../utils.cjs'; // Assuming you have a utility for formatting numbers

const play = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "play") {
    if (!text) {
      await m.reply("Please provide a song name or YouTube link.");
      return;
    }

    await m.react('🔎'); // React with a magnifying glass for searching

    try {
      const yt = await ytsearch(text);
      if (!yt.results.length) {
        await m.reply("No results found for your query.");
        return;
      }

      // Create a stylish list of search results with the player title
      let resultsText = "*🎧 POPKID XMD PLAYER 🎧*\n\n";
      resultsText += "*🎶 Search Results:*\n\n";
      yt.results.slice(0, 5).forEach((result, index) => { // Display the top 5 results
        resultsText += `*${index + 1}.* ${result.title}\n`;
        resultsText += `  ◦ 👁️ ${formatNumber(result.views)} views\n`;
        resultsText += `  ◦ 🔗 ${result.url}\n\n`;
      });
      resultsText += "_Reply with the number of the song you want to play._";

      await sock.sendMessage(m.from, { text: resultsText }, { quoted: m });

      // Set up a response listener for the user's choice
      sock.on('message', async (response) => {
        if (response.key.remoteJid === m.from && !response.key.fromMe && response.message?.conversation) {
          const selectedIndex = parseInt(response.message.conversation);
          if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= 5) {
            sock.off('message', this); // Remove the listener after a choice is made
            await m.react('🎵'); // React with a musical note for playing

            const selectedSong = yt.results[selectedIndex - 1];
            const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(selectedSong.url)}`;

            try {
              const res = await fetch(apiUrl);
              const data = await res.json();

              if (!data?.result?.downloadUrl) {
                await m.reply("Failed to get download link. Please try again later.");
                return;
              }

              await sock.sendMessage(m.from, {
                audio: { url: data.result.downloadUrl },
                mimetype: "audio/mpeg",
                fileName: `${selectedSong.title}.mp3`,
                contextInfo: {
                  externalAdReply: {
                    title: selectedSong.title.length > 25 ? `${selectedSong.title.substring(0, 22)}...` : selectedSong.title,
                    body: `▶️ Playing now on POPKID XMD PLAYER - ${formatNumber(selectedSong.views)} views`,
                    mediaType: 1,
                    thumbnailUrl: selectedSong.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
                    sourceUrl: selectedSong.url,
                    mediaUrl: selectedSong.url,
                    showAdAttribution: false,
                    renderLargerThumbnail: true
                  }
                }
              }, { quoted: m });

            } catch (error) {
              console.error(error);
              await m.reply("An error occurred while trying to play the selected song.");
            }
          } else if (response.message.conversation) {
            await m.reply("Invalid selection. Please reply with a number between 1 and 5.");
          }
        }
      });

    } catch (error) {
      console.error(error);
      await m.reply("An error occurred during the search.");
    }
  }
}

export default play;

