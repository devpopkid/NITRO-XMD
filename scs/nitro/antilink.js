import config from '../../config.cjs';

// 🛡️ In-memory variable to store antilink state (not persistent!)
let antilinkActive = false;
let antilinkMode = 'warn'; // ⚠️ Default mode: warn

const antilink = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');

  if (cmd === "antilink") {
    if (args.length === 0) {
      await m.reply(`
🛡️ *Antilink Guardian is Here!* 🛡️

Use these commands to control the link flow:

➡️ \`${prefix}antilink on\` <⚠️ *warn* | 🗑️ *delete* | 🦵 *kick*>
➡️ \`${prefix}antilink off\`
      `);
      return;
    }

    const action = args[0].toLowerCase();

    if (action === 'on') {
      if (args.length < 2 || !['warn', 'delete', 'kick'].includes(args[1].toLowerCase())) {
        await m.reply(`
⚙️ *Antilink Setup Error!* ⚙️

Use the correct mode:
➡️ \`${prefix}antilink on\` <⚠️ *warn* | 🗑️ *delete* | 🦵 *kick*>
        `);
        return;
      }
      antilinkActive = true;
      antilinkMode = args[1].toLowerCase();
      let modeEmoji = '';
      if (antilinkMode === 'warn') modeEmoji = '⚠️';
      if (antilinkMode === 'delete') modeEmoji = '🗑️';
      if (antilinkMode === 'kick') modeEmoji = '🦵';
      await m.reply(`
✅ *Antilink Activated!* ✅
Mode set to: ${modeEmoji} *${antilinkMode}*
      `);
      return;
    }

    if (action === 'off') {
      antilinkActive = false;
      await m.reply('🛑 *Antilink Deactivated.* 🛑');
      return;
    }

    await m.reply(`
❓ *Hmm, Unknown Action!* ❓

Try 'on' or 'off' to manage the antilink feature.
      `);
    return;
  }

  // 🔗 Link Sniffing and Action 🐾 (to be called in your main message handler)
  if (antilinkActive && m.hasQuotedMsg === false && m.fromMe === false) {
    const urlRegex = /(https?:\/\/|www\.)[^\s]+/gi;
    const links = m.body.match(urlRegex);

    if (links && links.length > 0) {
      if (antilinkMode === 'warn') {
        await m.reply(`
⚠️ *Link Alert!* ⚠️

Please be mindful of sharing links in this group. Further violations may lead to action.
        `);
      } else if (antilinkMode === 'delete') {
        try {
          await sock.sendMessage(m.from, { delete: m.key });
          await m.reply(`
🗑️ *Poof! Link Gone!* 🗑️

Links are not allowed as per group policy.
          `);
        } catch (error) {
          console.error("Error deleting message:", error);
          await m.reply(`
🚨 *Oops! Couldn't Delete Link!* 🚨

An error occurred while trying to remove the message.
          `);
        }
      } else if (antilinkMode === 'kick') {
        try {
          const groupMetadata = await sock.groupMetadata(m.from);
          const senderJid = m.sender;
          const isAdmin = groupMetadata.participants.find(p => p.id === senderJid)?.admin === 'admin' || groupMetadata.owner === senderJid;

          if (!isAdmin) {
            await sock.groupParticipantsUpdate(m.from, [senderJid], 'remove');
            await m.reply(`
🦵 *Farewell, Link Sender!* 🦵

You have been removed for sharing links. Please review the group rules.
            `);
          } else {
            await m.reply(`
🛡️ *Admin Link Detected!* 🛡️

A link was sent by an administrator. No action taken.
            `);
          }
        } catch (error) {
          console.error("Error kicking user:", error);
          await m.reply(`
🚧 *Kick Failure!* 🚧

An error occurred while trying to remove the user.
            `);
        }
      }
    }
  }
};

export default antilink;
