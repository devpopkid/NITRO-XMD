import axios from "axios";
import yts from "yt-search";
import config from '../config.cjs';

const play = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

  if (cmd === "play2") {
    if (args.length === 0 || !args.join(" ")) {
      return m.reply("*Please provide a song name or keywords to search for.*");
    }

    const searchQuery = args.join(" ");
    m.reply("*🎧 Searching for the song...*");

    try {
        let kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
        let songData = kyuu.data[0];
        if (!songData) {
            return reply("Song not found. Please try another search.");
        }

        // Send a "Playing song requested" message with a large thumbnail at the bottom
        await m.sendMessage(m.chat, {
            text: `🎵 *Playing:* ${songData.title}`,
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "HANS-TECH",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "ʜᴀɴs-xᴍᴅ_ᴠ2",
                    body: `HANSTZ`,
                    thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg', // Use thumbnail or default
                    sourceUrl: global.link,
                    mediaType: 1,
                    renderLargerThumbnail: true, // Render the large thumbnail below
                    thumbnailHeight: 500,
                    thumbnailWidth: 500, // Ensure thumbnail is large
                },
            },
        }, { quoted: m });

        // Fetch audio URL
        let tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
        let audioUrl = tylor.result.audio;
        if (!audioUrl) {
            return reply("Unable to fetch audio. Please try again.");
        }

        // Send the song as an audio file
        await m.sendMessage(m.chat, {
            audio: { url: audioUrl },
            fileName: `${songData.title}.mp3`,
            mimetype: "audio/mpeg",
            contextInfo: {
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "HANS-TECH",
                    newsletterJid: "120363352087070233@newsletter",
                },
                externalAdReply: {
                    title: "ʜᴀɴs-xᴍᴅ_ᴠ2",
                    body: `${songData.title}.mp3`,
                    thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailHeight: 500,
                    thumbnailWidth: 500,
                },
            },
        }, { quoted: m });

    } catch (error) {
        console.error("Error in play command:", error);
        reply("An error occurred while processing your request. Please try again later.");
    }
}
};

export default play2;
