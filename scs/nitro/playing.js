import config from '../../config.cjs';
import fetch from 'node-fetch';

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

const playSimple = async (m, sock) => {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === "play") {
        if (!text) {
            return m.reply("Tell me the song you want to play!");
        }

        try {
            await sock.sendMessage(m.from, { text: `Searching for "${text}"...` }, { quoted: m });

            let kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
            let songData = kyuu.data[0];

            if (!songData) {
                return m.reply("Sorry, I couldn't find that song.");
            }

            await sock.sendMessage(m.from, { text: `Found it! Getting the audio...` }, { quoted: m });

            const contextInfo = {
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
            };

            // Send initial "Now playing" message with context info
            await sock.sendMessage(m.from, {
                text: `🎧 Now playing: *${songData.title}* 🎧`,
                contextInfo: contextInfo,
            }, { quoted: m });

            let tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
            let audioUrl = tylor.result.audio;

            if (!audioUrl) {
                return m.reply("Error fetching the audio.");
            }

            // Send the audio file with context info
            await sock.sendMessage(m.from, {
                audio: { url: audioUrl },
                fileName: `${songData.title}.mp3`,
                mimetype: "audio/mpeg",
                contextInfo: contextInfo,
            }, { quoted: m });

            await sock.sendMessage(m.from, { text: `Enjoy the song! 🎉` }, { quoted: m });

        } catch (error) {
            console.error("Error in play command:", error);
            m.reply("Something went wrong. Please try again later.");
        }
    }
}

export default playSimple;
