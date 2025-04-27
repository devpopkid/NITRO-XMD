 import config from '../../config.cjs';
 

 const tagall = async (m, sock) => {
   const prefix = config.PREFIX;
   const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
 

   if (cmd === "tagall") {
     if (!m.isGroup) {
       await sock.sendMessage(m.from, { text: '🚫 This command is for groups only!' }, { quoted: m });
       return;
     }
 

     try {
       const groupMetadata = await sock.groupMetadata(m.from);
       const participants = groupMetadata.participants;
       const mentions = participants.map(({ id }) => id);
 

       const header = `╔═══════ 📢 POPKID XMD TAG 📢 ═══════╗\n`;
       let body = '';
       for (let i = 0; i < participants.length; i++) {
         const username = participants[i].id.split('@')[0];
         body += `║   ✨ @${username.padEnd(20)} ✨   ║\n`; // Adjust padding as needed
       }
       const footer = `╚═══════════ ${participants.length} Members Tagged! ═══════════╝`;
 

       const message = header + body + footer;
 

       await sock.sendMessage(m.from, { text: message, mentions: mentions }, { quoted: m });
     } catch (error) {
       console.error("Error tagging all members:", error);
       await sock.sendMessage(m.from, { text: '⚠️ Failed to tag all members. Please ensure the bot has the necessary permissions.', }, { quoted: m });
     }
   }
 };
 

 export default tagall;
