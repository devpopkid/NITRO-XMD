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
    if (['captain', 'hanscomman', 'commands'].includes(cmd)) {

  const uptimeMessage = `╔═════ஜ♻️ஜ═════╗
┇ ʙᴏᴛ ɴᴀᴍᴇ: *ᴄᴀᴘᴛᴀɪɴ-ᴍᴅ*
┇ ᴠᴇʀꜱɪᴏɴ: *7.1.0*     
┇ ᴅᴇᴠ: *ᴄᴀᴘᴛᴀɪɴ*
╚═════ஜ♻️ஜ═════╝ 

> *ℂ𝔸ℙ𝕋𝔸𝕀ℕ 𝕄𝔻 ℂ𝕆𝕄𝕄𝔸ℕ𝔻 𝕃𝕀𝕊𝕋*

 *𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝚆𝙸𝙻𝙻 𝙶𝚄𝙸𝙳𝙴✦
☆𝚈𝙾𝚄 𝙷𝙾𝚆 𝚃𝙾 𝚄𝚂𝙴 𝙷𝙰𝙽𝚂-𝙼𝙳*
 
╔═════ஜ♻️ஜ═════╗  
         *𝕊𝕐𝕊𝕋𝔼𝕄*         
  🇹🇿☛𝙿𝚒𝚗𝚐
  🇹🇿☛𝙰𝚕𝚒𝚟𝚎
  🇹🇿☛𝙾𝚠𝚗𝚎𝚛
  🇹🇿☛𝙼𝚎𝚗𝚞
╚═════ஜ♻️ஜ═════╝

╔═════ஜ♻️ஜ═════╗
          *𝕆𝕎ℕ𝔼ℝ*          
  🇹🇿☛𝙹𝚘𝚒𝚗
  🇹🇿☛𝙻𝚎𝚊𝚟𝚎
  🇹🇿☛𝙱𝚕𝚘𝚌𝚔 
  🇹🇿☛𝚄𝚗𝚋𝚕𝚘𝚌𝚔
  🇹🇿☛𝚂𝚎𝚝𝚙𝚙𝚋𝚘𝚝
  🇹🇿☛𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕
  🇹🇿☛𝚂𝚎𝚝𝚜𝚝𝚊𝚝𝚞𝚜
  🇹🇿☛𝚂𝚎𝚝𝚗𝚊𝚖𝚎𝚋𝚘𝚝
  🇹🇿☛𝙰𝚞𝚝𝚘𝚃𝚢𝚙𝚒𝚗𝚐
  🇹🇿☛𝙰𝚕𝚠𝚊𝚢𝚜𝙾𝚗𝚕𝚒𝚗𝚎
  🇹🇿☛𝙰𝚞𝚝𝚘𝚁𝚎𝚊𝚍
  🇹🇿☛𝚊𝚞𝚝𝚘𝚜𝚟𝚒𝚎𝚠
╚═════ஜ♻️ஜ═════╝

╔═════ஜ♻️ஜ═════╗
           *𝔾ℙ𝕋*          
  🇹🇿☛𝙰𝚒
  🇹🇿☛𝙱𝚞𝚐
  🇹🇿☛𝚁𝚎𝚙𝚘𝚛𝚝
  🇹🇿☛𝙶𝚙𝚝
  🇹🇿☛𝙳𝚊𝚕𝚕𝚎
  🇹🇿☛𝚁𝚎𝚖𝚒𝚗𝚒
  🇹🇿☛𝙶𝚎𝚖𝚒𝚗𝚒
╚═════ஜ♻️ஜ═════╝
 
╔═════ஜ♻️ஜ═════╗
       *ℂ𝕆ℕ𝕍𝔼ℝ𝕋𝔼ℝ*       
  🇹🇿☛𝙰𝚃𝚃𝙿
  🇹🇿☛𝙰𝚃𝚃𝙿2
  🇹🇿☛𝙰𝚃𝚃𝙿3
  🇹🇿☛𝙴𝙱𝙸𝙽𝙰𝚁𝚈
  🇹🇿☛𝙳𝙱𝙸𝙽𝙰𝚁𝚈
  🇹🇿☛𝙴𝙼𝙾𝙹𝙸𝙼𝙸𝚇
  🇹🇿☛𝙼𝙿3
  🇹🇿☛fancy
╚═════ஜ♻️ஜ═════╝

╔═════ஜ♻️ஜ═════╗
          *𝔾ℝ𝕆𝕌ℙ*      
  🇹🇿☛𝙻𝚒𝚗𝚔𝙶𝚛𝚘𝚞𝚙
  🇹🇿☛𝚂𝚎𝚝𝚙𝚙𝚐𝚌
  🇹🇿☛𝚂𝚎𝚝𝚗𝚊𝚖𝚎
  🇹🇿☛𝚂𝚎𝚝𝚍𝚎𝚜𝚌
  🇹🇿☛𝙶𝚛𝚘𝚞𝚙
  🇹🇿☛𝙶𝚌𝚜𝚎𝚝𝚝𝚒𝚗𝚐
  🇹🇿☛𝚆𝚎𝚕𝚌𝚘𝚖𝚎
  🇹🇿☛𝙰𝚍𝚍
  🇹🇿☛𝙺𝚒𝚌𝚔
  🇹🇿☛𝙷𝚒𝚍𝚎𝚃𝚊𝚐
  🇹🇿☛𝚃𝚊𝚐𝚊𝚕𝚕
  🇹🇿☛𝙰𝚗𝚝𝚒𝙻𝚒𝚗𝚔
  🇹🇿☛𝙰𝚗𝚝𝚒𝚃𝚘𝚡𝚒𝚌
  🇹🇿☛𝙿𝚛𝚘𝚖𝚘𝚝𝚎
  🇹🇿☛𝙳𝚎𝚖𝚘𝚝𝚎
  🇹🇿☛𝙶𝚎𝚝𝚋𝚒𝚘
╚═════ஜ♻️ஜ═════╝

╔═════ஜ♻️ஜ═════╗
        *𝔻𝕆𝕎ℕ𝕃𝕆𝔸𝔻*      
  🇹🇿☛𝙰𝚙𝚔
  🇹🇿☛𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔
  🇹🇿☛𝙼𝚎𝚍𝚒𝚊𝚏𝚒𝚛𝚎
  🇹🇿☛𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝𝚍𝚕
  🇹🇿☛𝙶𝚒𝚝𝚌𝚕𝚘𝚗𝚎
  🇹🇿☛𝙶𝚍𝚛𝚒𝚟𝚎
  🇹🇿☛𝙸𝚗𝚜𝚝𝚊
  🇹🇿☛𝚈𝚝𝚖𝚙3
  🇹🇿☛𝚈𝚝𝚖𝚙4
  🇹🇿☛𝙿𝚕𝚊𝚢
  🇹🇿☛𝚂𝚘𝚗𝚐
  🇹🇿☛𝚅𝚒𝚍𝚎𝚘
  🇹🇿☛𝚈𝚝𝚖𝚙3𝚍𝚘𝚌
  🇹🇿☛𝚈𝚝𝚖𝚙4𝚍𝚘𝚌
  🇹🇿☛𝚃𝚒𝚔𝚝𝚘𝚔
╚═════ஜ♻️ஜ═════╝

╔═════ஜ♻️ஜ═════╗
         *𝕊𝔼𝔸ℝℂℍ*        
  🇹🇿☛𝙿𝚕𝚊𝚢
  🇹🇿☛𝚈𝚝𝚜
  🇹🇿☛𝙸𝚖𝚍𝚋
  🇹🇿☛𝙶𝚘𝚘𝚐𝚕𝚎
  🇹🇿☛𝙶𝚒𝚖𝚊𝚐𝚎
  🇹🇿☛𝙻𝚢𝚛𝚒𝚌𝚜
╚═════ஜ♻️ஜ═════╝

*MORE COMMANDS*
*WILL BE UPLOADED*
*SOON*
╔═══════ஜ♻️ஜ═══════╗
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
©ᴄᴀᴘᴛᴀɪɴ-ᴍᴅ-ᴍᴀᴅᴇ ɪɴ ᴛᴀɴᴢᴀɴɪᴀ
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
 ▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄🇹🇿▄
╚═══════ஜ♻️ஜ═══════╝
`;

  const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "🗃️ REPO",
          id: `${prefix}repo`
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
            text: "© ℂ𝔸ℙ𝕋𝔸𝕀ℕ"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            gifPlayback: true,
            subtitle: "",
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
                  newsletterJid: '255618076073',
                  newsletterName: "ℂ𝔸ℙ𝕋𝔸𝕀ℕ-𝕄𝔻",
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