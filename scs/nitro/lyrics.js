import axios from 'axios';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const Lyrics = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['lyrics', 'lyric'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply(`Hello *_${m.pushName}_,*\n Here's Example Usage: _.lyrics Spectre|Alan Walker._`);

    try {
      await m.React('🎶'); // Added a musical note emoji
      await m.reply('Fetching lyrics... 🎧'); // More engaging message

      if (!text.includes('|')) {
        return m.reply('Please provide the song name and artist name separated by a "|", for example: Spectre|Alan Walker.');
      }

      const [title, artist] = text.split('|').map(part => part.trim());

      if (!title || !artist) {
        return m.reply('Both song name and artist name are required. Please provide them in the format: song name|artist name.');
      }

      const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (response.status === 404) {
        await m.reply(`Sorry, no lyrics found for *${title.trim()}* by *${artist.trim()}*. 😔`);
        return await m.React('⚠️'); // Changed to a warning emoji
      }

      if (result && result.lyrics) {
        const lyrics = result.lyrics;
        const formattedLyrics = `🎤 *${title.trim()}* - *${artist.trim()}*\n\n\`\`\`\n${lyrics.trim()}\n\`\`\``; // Using code block for a cleaner look

        let buttons = [{
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 Copy Lyrics",
            id: "copy_code",
            copy_code: lyrics
          })
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "🌐 Follow Wachannel",
            url: `https://whatsapp.com/channel/0029VadQrNI8KMqo79BiHr3l`
          })
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🏠 Main Menu",
            id: ".menu"
          })
        }
        ];

        let msg = generateWAMessageFromContent(m.from, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: formattedLyrics
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "🎶 Powered by Lyrics.ovh" // Added a subtle footer
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "",
                  subtitle: "",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: buttons
                })
              })
            }
          }
        }, {});

        await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id
        });

        await m.React('✅');
      } else {
        throw new Error('Invalid response format from the Lyrics API.'); // More specific error
      }
    } catch (error) {
      console.error('Error getting lyrics:', error.message);
      m.reply('Failed to retrieve lyrics. Please try again later. 😔'); // More user-friendly error
      await m.React('❌');
    }
  }
};

export default Lyrics;
