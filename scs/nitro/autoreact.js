import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoreact') {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_REACT_SENDER = true;
      config.AUTO_REACT_RECEIVER = true;
      responseMessage = "✅ Auto-react has been enabled for both sender and receiver. 🎉";
    } else if (text === 'off') {
      config.AUTO_REACT_SENDER = false;
      config.AUTO_REACT_RECEIVER = false;
      responseMessage = "❌ Auto-react has been disabled for both sender and receiver. 😴";
    } else {
      responseMessage = `⚙️ Usage:\n- \`${prefix}autoreact on\`: Enable Auto-React for both 🚀\n- \`${prefix}autoreact off\`: Disable Auto-React for both 💤`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("🚨 Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Error processing your request.' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
