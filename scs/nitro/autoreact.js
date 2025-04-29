import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoreact') {
    if (!isCreator) return m.reply("*📛 🔒 OWNER COMMAND ONLY! 🚫*");
    let responseMessage;

    if (text === 'on') {
      config.AUTO_REACT = true;
      responseMessage = "✅✨ Auto-React is now ON! 🎉";
    } else if (text === 'off') {
      config.AUTO_REACT = false;
      responseMessage = "❌😴 Auto-React is now OFF. 💤";
    } else {
      responseMessage = `⚙️✨ Usage: ✨⚙️\n- \`${prefix}autoreact on\`: Enable Auto-React 🚀\n- \`${prefix}autoreact off\`: Disable Auto-React 🚫`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("🚨🔥 Error processing request: 🔥🚨", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Oops! Something went wrong. 🤕 Please try again.' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
