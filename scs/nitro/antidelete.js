import config from '../../config.cjs';
import { setAnti, getAnti } from './antiDeleteStateManager.js';

const antiDeleteCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const q = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "antidelete") {
    try {
      const subCommand = q?.toLowerCase();

      switch (subCommand) {
        case 'on':
          await setAnti('gc', true);
          await setAnti('dm', true);
          return sock.sendMessage(m.from, {
            text: `✨ *_AntiDelete Activated_* ✨\n\n🛡️ *Status:* Enabled for both Group Chats and Direct Messages.`,
          }, { quoted: m });

        case 'off gc':
          await setAnti('gc', false);
          return sock.sendMessage(m.from, {
            text: `⚠️ *_AntiDelete Deactivated_* ⚠️\n\n💬 *Group Chats:* Disabled.`,
          }, { quoted: m });

        case 'off dm':
          await setAnti('dm', false);
          return sock.sendMessage(m.from, {
            text: `⚠️ *_AntiDelete Deactivated_* ⚠️\n\n👤 *Direct Messages:* Disabled.`,
          }, { quoted: m });

        case 'set gc':
          const gcStatus = await getAnti('gc');
          await setAnti('gc', !gcStatus);
          return sock.sendMessage(m.from, {
            text: `⚙️ *_AntiDelete Settings Updated_* ⚙️\n\n💬 *Group Chats:* ${!gcStatus ? '*Enabled*' : '*Disabled*'}.`,
          }, { quoted: m });

        case 'set dm':
          const dmStatus = await getAnti('dm');
          await setAnti('dm', !dmStatus);
          return sock.sendMessage(m.from, {
            text: `⚙️ *_AntiDelete Settings Updated_* ⚙️\n\n👤 *Direct Messages:* ${!dmStatus ? '*Enabled*' : '*Disabled*'}.`,
          }, { quoted: m });

        case 'set all':
          await setAnti('gc', true);
          await setAnti('dm', true);
          return sock.sendMessage(m.from, {
            text: `✅ *_AntiDelete Set for All Chats_* ✅\n\n🛡️ *Group Chats:* Enabled\n👤 *Direct Messages:* Enabled`,
          }, { quoted: m });

        case 'status':
          const currentDmStatus = await getAnti('dm');
          const currentGcStatus = await getAnti('gc');
          return sock.sendMessage(m.from, {
            text: `📊 *_AntiDelete Status Report_* 📊\n\n👤 *Direct Messages:* ${currentDmStatus ? '*Enabled*' : '*Disabled*'}\n💬 *Group Chats:* ${currentGcStatus ? '*Enabled*' : '*Disabled*'}`,
          }, { quoted: m });

        default:
          const helpMessage = `📜 *_AntiDelete Command Guide_* 📜\n\n` +
            `• \`${prefix}antidelete on\` - ✨ Enable AntiDelete for all chats\n` +
            `• \`${prefix}antidelete off gc\` - 💬 Disable AntiDelete for Group Chats\n` +
            `• \`${prefix}antidelete off dm\` - 👤 Disable AntiDelete for Direct Messages\n` +
            `• \`${prefix}antidelete set gc\` - ⚙️ Toggle AntiDelete for Group Chats\n` +
            `• \`${prefix}antidelete set dm\` - ⚙️ Toggle AntiDelete for Direct Messages\n` +
            `• \`${prefix}antidelete set all\` - ✅ Enable AntiDelete for all chats\n` +
            `• \`${prefix}antidelete status\` - 📊 Check current AntiDelete status`;

          return sock.sendMessage(m.from, { text: helpMessage }, { quoted: m });
      }
    } catch (e) {
      console.error("Error in antidelete command:", e);
      return sock.sendMessage(m.from, { text: "⚠️ *Error:* An error occurred while processing your request. ⚠️", }, { quoted: m });
    }
  }
};

export default antiDeleteCommand;
