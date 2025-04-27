import { serialize } from '../../lib/Serializer.js';

const antilinkSettings = {}; // { groupId: { enabled: boolean, warningLimit: number, warnedUsers: { userId: warningCount } } }

export const handleAntilink = async (m, sock, logger, isBotAdmins, isAdmins, isCreator) => {
    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd === 'antilink') {
        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        const action = args[0] ? args[0].toLowerCase() : '';

        if (!m.isGroup) {
            await sock.sendMessage(m.from, { text: '🚫 This command is exclusively for group chats! 🚫' }, { quoted: m });
            return;
        }

        if (!isBotAdmins) {
            await sock.sendMessage(m.from, { text: '👮‍♀️ For me to manage the antilink feature effectively, I need to be an admin in this group. Please grant me the necessary permissions! 🙏' }, { quoted: m });
            return;
        }

        if (action === 'on') {
            if (isAdmins) {
                antilinkSettings[m.from] = { enabled: true, warningLimit: 3, warnedUsers: {} }; // Setting default warning limit
                await sock.sendMessage(m.from, { text: '✅ Antilink feature is now 활성화 (active) in this group! 🛡️' }, { quoted: m });
            } else {
                await sock.sendMessage(m.from, { text: '🔒 Sorry, only the group admins have the privilege to enable this सुरक्षा (security) feature. 🛡️' }, { quoted: m });
            }
            return;
        }

        if (action === 'off') {
            if (isAdmins) {
                delete antilinkSettings[m.from];
                await sock.sendMessage(m.from, { text: '🔓 Got it! The antilink feature has been 비활성화 (deactivated) for this group. 🕊️' }, { quoted: m });
            } else {
                await sock.sendMessage(m.from, { text: '🔑 Apologies, but only group admins can disable this safeguard. 🛡️' }, { quoted: m });
            }
            return;
        }

        if (action === 'warnlimit' && args[1] && !isNaN(args[1])) {
            const limit = parseInt(args[1]);
            if (isAdmins) {
                if (antilinkSettings[m.from]) {
                    antilinkSettings[m.from].warningLimit = limit;
                    await sock.sendMessage(m.from, { text: `⚠️ Okay, the antilink warning limit is now set to ${limit} strikes! 🚦` }, { quoted: m });
                } else {
                    await sock.sendMessage(m.from, { text: '🤔 Hmm, the antilink feature isn\'t enabled in this group yet. Use `/antilink on` to turn it on first! 🚀' }, { quoted: m });
                }
            } else {
                await sock.sendMessage(m.from, { text: '🛡️ Only admins have the authority to adjust the warning limit. ⚙️' }, { quoted: m });
            }
            return;
        }

        await sock.sendMessage(m.from, { text: `⚙️ Usage: ${prefix + cmd} on | off | warnlimit <number> 🛠️` }, { quoted: m });
        return;
    }

    if (antilinkSettings[m.from] && antilinkSettings[m.from].enabled) {
        const groupLinkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/gi;
        const matchedLinks = m.body.match(groupLinkRegex);

        if (matchedLinks) {
            if (!isBotAdmins) {
                await sock.sendMessage(m.from, { text: `👮‍♀️ To effectively manage links and maintain order, I need to be an administrator in this group. Kindly grant me admin status! 🙏` });
                return;
            }

            const currentGroupInvite = await sock.groupInviteCode(m.from);
            const currentGroupLinkRegex = new RegExp(`(?:https?:\/\/)?chat\\.whatsapp\\.com\\/${currentGroupInvite}`, 'i');

            for (const link of matchedLinks) {
                if (currentGroupLinkRegex.test(link)) {
                    await sock.sendMessage(m.from, { text: `🔗 That link points right back to this amazing group! 😉` });
                    continue;
                }

                if (isAdmins || isCreator) {
                    await sock.sendMessage(m.from, { text: `👑 As an admin or the esteemed group creator, you have the green light to share links! 🚀` });
                    continue;
                }

                const sender = m.sender;
                if (!antilinkSettings[m.from].warnedUsers[sender]) {
                    antilinkSettings[m.from].warnedUsers[sender] = 0;
                }
                antilinkSettings[m.from].warnedUsers[sender]++;

                const warningCount = antilinkSettings[m.from].warnedUsers[sender];
                const warningLimit = antilinkSettings[m.from].warningLimit || 3; // Defaulting to 3 if not explicitly set

                // Immediately zap 💥 the message containing the forbidden link
                try {
                    await sock.sendMessage(m.from, {
                        delete: {
                            remoteJid: m.from,
                            fromMe: false,
                            id: m.key.id,
                            participant: m.key.participant
                        }
                    });
                } catch (error) {
                    logger.error(`⚠️ Uh oh! Encountered an error while trying to delete a suspicious message from ${sender} in ${m.from}: ${error}`);
                    await sock.sendMessage(m.from, { text: `😬 Oops! I couldn't quite delete that link message...` });
                }

                if (warningCount >= warningLimit) {
                    // Time to bid farewell 👋 to the link spammer
                    try {
                        await sock.groupParticipantsUpdate(m.from, [sender], 'remove');
                        await sock.sendMessage(m.from, {
                            text: `@${sender.split("@")[0]} has been removed 🚪 for repeatedly sharing group links (beyond the ${warningLimit} warning threshold! 🚫)`,
                            contextInfo: { mentionedJid: [sender] }
                        });
                        delete antilinkSettings[m.from].warnedUsers[sender]; // Resetting the warning count for this user
                    } catch (error) {
                        logger.error(`🚨 An error occurred while attempting to remove ${sender} from ${m.from}: ${error}`);
                        await sock.sendMessage(m.from, { text: `😓 I couldn't remove @${sender.split("@")[0]} due to a technical hiccup.`, contextInfo: { mentionedJid: [sender] } });
                    }
                } else {
                    // A gentle nudge 👆 and a friendly warning this time
                    await sock.sendMessage(m.from, {
                        text: `\`\`\`「 🔗 Group Link Detected! 🔗 」\`\`\`\n\nHey @${sender.split("@")[0]}, please be mindful of sharing group invite links here. You've received ${warningCount}/${warningLimit} warnings. Further violations will unfortunately lead to removal from the group. ⚠️`,
                        contextInfo: { mentionedJid: [sender] }
                    }, { quoted: m });
                }
            }
        }
    }
};
