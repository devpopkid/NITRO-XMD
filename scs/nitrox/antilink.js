import { serialize } from '../../lib/Serializer.js';

const antilinkSettings = {}; // 🛡️ Per-group settings for antilink
const antilinkModeSettings = {}; // ⚙️ Per-group settings for antilink mode ('warn', 'delete', 'kick')

export const handleAntilink = async (m, sock, logger, isBotAdmins, isAdmins, isCreator) => {
    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd === 'antilink') {
        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        const action = args[0] ? args[0].toLowerCase() : '';
        const mode = args[1] ? args[1].toLowerCase() : '';

        if (!m.isGroup) {
            await sock.sendMessage(m.from, { text: '*🚫 Group Only Zone! 🚫*\nThis command works best within the cozy confines of a group chat.' }, { quoted: m });
            return;
        }

        if (!isBotAdmins) {
            await sock.sendMessage(m.from, { text: '*🤖 Admin Eyes Needed! 🤖*\nTo wield the power of antilink, I require administrator privileges in this group.' }, { quoted: m });
            return;
        }

        if (action === 'on') {
            if (isAdmins) {
                if (['warn', 'delete', 'kick'].includes(mode)) {
                    antilinkSettings[m.from] = true;
                    antilinkModeSettings[m.from] = mode;
                    let modeEmoji = '';
                    if (mode === 'warn') modeEmoji = '⚠️';
                    if (mode === 'delete') modeEmoji = '🗑️';
                    if (mode === 'kick') modeEmoji = '🦵';
                    await sock.sendMessage(m.from, { text: `*✨ Antilink Activated! ✨*\nMode set to: *${mode.toUpperCase()}* ${modeEmoji}\nThis group is now under link protection!` }, { quoted: m });
                } else {
                    await sock.sendMessage(m.from, { text: `*⚙️ Antilink Setup ⚙️*\nUse: \`${prefix + cmd} on\` <⚠️ *warn* | 🗑️ *delete* | 🦵 *kick*>\nChoose your preferred level of link enforcement!` }, { quoted: m });
                }
            } else {
                await sock.sendMessage(m.from, { text: '*🔒 Admin Authority Required! 🔒*\nOnly group administrators can toggle the antilink feature.' }, { quoted: m });
            }
            return;
        }

        if (action === 'off') {
            if (isAdmins) {
                antilinkSettings[m.from] = false;
                delete antilinkModeSettings[m.from]; // Remove mode setting when turning off
                await sock.sendMessage(m.from, { text: '*🔓 Antilink Deactivated! 🔓*\nLink sharing is now permitted in this chat.' }, { quoted: m });
            } else {
                await sock.sendMessage(m.from, { text: '*🔒 Admin Authority Required! 🔒*\nOnly group administrators can disable the antilink feature.' }, { quoted: m });
            }
            return;
        }

        await sock.sendMessage(m.from, { text: `*⚙️ Antilink Control Panel ⚙️*\nUse: \`${prefix + cmd} on\` <⚠️ *warn* | 🗑️ *delete* | 🦵 *kick*>\n     \`${prefix + cmd} off\`\nManage how this group handles shared links.` }, { quoted: m });
        return;
    }

    if (antilinkSettings[m.from]) {
        if (m.body.match(/(chat.whatsapp.com\/)/gi)) {
            if (!isBotAdmins) {
                await sock.sendMessage(m.from, { text: '*🤖 Admin Privileges Needed! 🤖*\nI require admin status to intercept and manage those pesky links!' });
                return;
            }
            let gclink = `https://chat.whatsapp.com/${await sock.groupInviteCode(m.from)}`;
            let isLinkThisGc = new RegExp(gclink, 'i');
            let isgclink = isLinkThisGc.test(m.body);
            if (isgclink) {
                await sock.sendMessage(m.from, { text: '*🔗 Friendly Fire! 🔗*\nThat's a link to *this* very group! No action taken.' });
                return;
            }
            if (isAdmins) {
                await sock.sendMessage(m.from, { text: '*👑 Admin Override! 👑*\nAs an admin, your links are welcome here.' });
                return;
            }
            if (isCreator) {
                await sock.sendMessage(m.from, { text: '*🌟 Creator's Privilege! 🌟*\nThe group creator has the freedom to share!' });
                return;
            }

            const currentAntilinkMode = antilinkModeSettings[m.from] || 'warn'; // Default to 'warn' if not set

            if (currentAntilinkMode === 'warn') {
                // ⚠️ First, a stylish warning!
                await sock.sendMessage(m.from, {
                    text: `\`\`\`⚠️ 📢 Link Alert! 📢 ⚠️\`\`\`\n\nHey @${m.sender.split("@")[0]}, a group invite link has been detected! Please refrain from sharing them in this chat. Continued sharing may result in further action.`,
                    contextInfo: { mentionedJid: [m.sender] }
                }, { quoted: m });
            } else if (currentAntilinkMode === 'delete') {
                // 🗑️ Then, a swift deletion!
                try {
                    await sock.sendMessage(m.from, {
                        delete: {
                            remoteJid: m.from,
                            fromMe: false,
                            id: m.key.id,
                            participant: m.key.participant
                        }
                    });
                    await sock.sendMessage(m.from, { text: '*🗑️ Link Vanished! 💨*\nThat link has been removed as per group policy.' });
                } catch (error) {
                    console.error("Error deleting message:", error);
                    await sock.sendMessage(m.from, { text: '*⚠️ Uh Oh! ⚠️*\nFailed to delete the link. Please ensure I have the necessary permissions.' });
                }
            } else if (currentAntilinkMode === 'kick') {
                // 🦵 And finally, a stylish kick!
                await sock.sendMessage(m.from, {
                    text: `\`\`\`🚫 🚪 Link Detected - User Removed! 🚪 🚫\`\`\`\n\n@${m.sender.split("@")[0]}, you have been removed from the group for sharing unauthorized group invite links. Please review the group rules.`,
                    contextInfo: { mentionedJid: [m.sender] }
                }, { quoted: m });
                setTimeout(async () => {
                    try {
                        await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove');
                        await sock.sendMessage(m.from, { text: `*🦵 User Kicked! 🚪*\n@${m.sender.split("@")[0]} has been removed for link sharing.` , contextInfo: { mentionedJid: [m.sender] } });
                    } catch (error) {
                        console.error("Error kicking user:", error);
                        await sock.sendMessage(m.from, { text: '*⚠️ Emergency! ⚠️*\nFailed to kick the user. Please verify my admin privileges.' });
                    }
                }, 3000); // 3 seconds delay before kick
            }
        }
    }
};
