import config from '../../config.cjs';

const groupLock = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const isGroup = m.key.remoteJid.endsWith('@g.us');

  if (!isGroup) {
    return;
  }

  if (cmd === "lockgc") {
    await m.React('🔒'); // Lock emoji
    try {
      await sock.groupSettingUpdate(m.from, 'announcement', true);
      await m.reply('✨ *🔒️ Group Locked!* ✨\n\n🛡️ *Only administrators can now send messages in this group.*');
    } catch (error) {
      console.error("Error locking group:", error);
      await m.reply('⚠️ *Failed to Lock Group!* ⚠️\n\n⚙️ *Please ensure the bot has administrator privileges to perform this action.*');
    }
  } else if (cmd === "unlockgc") {
    await m.React('🔓'); // Unlock emoji
    try {
      await sock.groupSettingUpdate(m.from, 'announcement', false);
      await m.reply('🌟 *🔓️ Group Unlocked!* 🌟\n\n🗣️ *All members can now send messages in this group.*');
    } catch (error) {
      console.error("Error unlocking group:", error);
      await m.reply('🚨 *Failed to Unlock Group!* 🚨\n\n⚙️ *Please ensure the bot has administrator privileges to perform this action.*');
    }
  }
};

export default groupLock;
