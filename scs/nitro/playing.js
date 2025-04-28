import config from '../../config.cjs';
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
            return m.reply("🎶 Tell me the song you're in the mood for! 🎶");
        }

        try {
            await sock.sendMessage(m.from, { text: `🔎 Diving into the musical universe to find "${text}"...` }, { quoted: m });

            let kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
            let songData = kyuu.data[0];

            if (!songData) {
                return m.reply("Hmm, couldn't quite catch that tune. 😔 Maybe try a different spelling?");
            }

            await sock.sendMessage(m.from, { text: `🎵 Got it! Just a moment...` }, { quoted: m });

            // --- Sleek Song Info Card ---
            const songInfoBox = `\n🎼 *Track:* ${songData.title}\n👁️ *Views:* ${songData.views ? formatNumber(songData.views) : 'N/A'}\n🗓️ *Released:* ${songData.uploadDate || 'N/A'}\n`;
            const fancyDivider = "✨----------------------------------✨";

            // Send initial "Playing" message with context info and large thumbnail
            await sock.sendMessage(m.from, {
                text: `${fancyDivider}\n${songInfoBox}${fancyDivider}\n\n🎧 Now playing: *${songData.title}* 🎧`,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "🎶 The PopKid Jukebox 🎶", // Even fancier bot name
                        newsletterJid: "120363290715861418@newsletter",
                    },
                    externalAdReply: {
                        title: "🔊 Experience the Rhythm! 🔊",
                        body: `Now listening to: ${songData.title}`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        sourceUrl: global.link || 'https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

            await sock.sendMessage(m.from, { text: `⏳ Fetching the audio waves...` }, { quoted: m });

            // Fetch audio URL
            let tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
            let audioUrl = tylor.result.audio;

            if (!audioUrl) {
                return m.reply("⚠️ Uh oh! Couldn't grab the audio. Let's try that again in a bit. 😔");
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
                        newsletterName: "🎶 The PopKid Jukebox 🎶", // Even fancier bot name
                        newsletterJid: "120363290715861418@newsletter",
                    },
                    externalAdReply: {
                        title: `🎧 Enjoy the vibes of: ${songData.title}! 🎧`,
                        body: `.mp3 audio delivered with style`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

            await sock.sendMessage(m.from, { text: `✅ The beat is yours! Enjoy the music! 🎉` }, { quoted: m });

        } catch (error) {
            console.error("Error in play command:", error);
            m.reply("Hmm, something went a little sideways. 😅 Let's give it another shot later!");
        }
    }
}

export default play;
