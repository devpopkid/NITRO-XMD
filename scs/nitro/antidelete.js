import config from '../../config.cjs';
import { setAnti, getAnti } from '../../lib/antidelete.js'; // adjust the import path if needed

const antidelete = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const q = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'antidelete') {
    try {
      switch (q) {
        case 'on':
          await setAnti('gc', true);
          await setAnti('dm', true);
          await m.React('✅');
          return sock.sendMessage(m.from, { text: '_AntiDelete is now enabled for Group Chats and Direct Messages._' }, { quoted: m });

        case 'off gc':
          await setAnti('gc', false);
          await m.React('✅');
          return sock.sendMessage(m.from, { text: '_AntiDelete for Group Chats is now disabled._' }, { quoted: m });

        case 'off dm':
          await setAnti('dm', false);
          await m.React('✅');
          return sock.sendMessage(m.from, { text: '_AntiDelete for Direct Messages is now disabled._' }, { quoted: m });

        case 'set gc':
          const gcStatus = await getAnti('gc');
          await setAnti('gc', !gcStatus);
          await m.React('✅');
          return sock.sendMessage(m.from, { text: `_AntiDelete for Group Chats is now ${!gcStatus ? 'enabled' : 'disabled'}._` }, { quoted: m });

        case 'set dm':
          const dmStatus = await getAnti('dm');
          await setAnti('dm', !dmStatus);
          await m.React('✅');
          return sock.sendMessage(m.from, { text: `_AntiDelete for Direct Messages is now ${!dmStatus ? 'enabled' : 'disabled'}._` }, { quoted: m });

        case 'set all':
          await setAnti('gc', true);
          await setAnti('dm', true);
          await m.React('✅');
          return sock.sendMessage(m.from, { text: '_AntiDelete has been enabled for all chats._' }, { quoted: m });

        case 'status':
          const currentDmStatus = await getAnti('dm');
          const currentGcStatus = await getAnti('gc');
          await m.React('ℹ️');
          return sock.sendMessage(m.from, { 
            text: `*AntiDelete Status*\n\n*Direct Messages:* ${currentDmStatus ? 'Enabled' : 'Disabled'}\n*Group Chats:* ${currentGcStatus ? 'Enabled' : 'Disabled'}` 
          }, { quoted: m });

        default:
          await m.React('❓');
          const helpMessage = `*AntiDelete Command Guide:*\n
• \`\`${prefix}antidelete on\`\` - Enable AntiDelete for all chats
• \`\`${prefix}antidelete off gc\`\` - Disable AntiDelete for Group Chats
• \`\`${prefix}antidelete off dm\`\` - Disable AntiDelete for Direct Messages
• \`\`${prefix}antidelete set gc\`\` - Toggle AntiDelete for Group Chats
• \`\`${prefix}antidelete set dm\`\` - Toggle AntiDelete for Direct Messages
• \`\`${prefix}antidelete set all\`\` - Enable AntiDelete for all chats
• \`\`${prefix}antidelete status\`\` - Show current AntiDelete status`;

          return sock.sendMessage(m.from, { text: helpMessage }, { quoted: m });
      }
    } catch (e) {
      console.error("Error in antidelete command:", e);
      await m.React('⚠️');
      return sock.sendMessage(m.from, { text: 'An error occurred while processing your request.' }, { quoted: m });
    }
  }
}

export default antidelete;
