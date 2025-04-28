import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';

  if (['alive', 'uptime', 'runtime'].includes(cmd)) {
    const uptimeMessage = `*🔹 POPKID MD IS ACTIVE 🔹*

╭───────═━┈┈━═──━┈⊷
┇ *🗓️ ${days} Day(s)* 
┇ *⏰ ${hours} Hour(s)*
┇ *🕒 ${minutes} Minute(s)*
┇ *⏳ ${seconds} Second(s)*
╰───────═━┈┈━═──━┈⊷

💡 *Your bot is up and running!*

*⚡ Fast, reliable, and always on!*
    
_Stay tuned for more updates!_ 🔥

`;

    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "Ping ⏳",
          id: `${prefix}ping`
        })
      }
    ];

    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: uptimeMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© popkid | Always Active 🔥"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: "🚀 POPKID MD - Uptime Status",
              gifPlayback: true,
              subtitle: "Bot Status",
              hasMediaAttachment: false 
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            }),
            contextInfo: {
              mentionedJid: [m.sender], 
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '254111385747',
                newsletterName: "POPKID MD",
                serverMessageId: 143
              }
            }
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default alive;
