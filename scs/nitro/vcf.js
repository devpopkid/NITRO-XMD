import config from '../../config.cjs';
import { vcard } from '@adiwajshing/baileys'; // Assuming you're using baileys

const contacts = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "contacts") {
    const start = new Date().getTime();
    await m.React('⏳'); // Initial "ping style" feedback

    if (!m.isGroup) {
      await sock.sendMessage(m.from, { text: 'This command can only be used in groups.' }, { quoted: m });
      return;
    }

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const vcfString = [];
      const emojis = ['😀', '😎', '🥳', '👍', '🌟', '🎉', '🎈', '🎁', '🎵', '🎶']; // Example emojis

      for (const participant of participants) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const contactName = participant.pushName || participant.id.split('@')[0]; // Try pushName, else use phone number
        const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${randomEmoji} ${contactName}\nTEL;type=CELL;waid=${participant.id.split('@')[0]}:${participant.id.split('@')[0]}\nEND:VCARD`;
        vcfString.push(vcardData);
      }

      const vcfFile = vcfString.join('\n');
      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;
      const processingIndicator = 'Gathering Contacts  sammeln  sammeln  sammeln  sammeln  sammeln  sammeln  sammeln'; // Mimicking the ping style

      await sock.sendMessage(
        m.from,
        {
          document: Buffer.from(vcfFile),
          mimetype: 'text/vcard',
          fileName: `group_contacts_${groupMetadata.subject.replace(/\s+/g, '_')}.vcf`,
          caption: `*${processingIndicator} ${responseTime.toFixed(2)} s* - Here are the group contacts!`, // Adding a caption with "ping style" info
        },
        { quoted: m }
      );
    } catch (error) {
      console.error('Error fetching contacts:', error);
      await sock.sendMessage(m.from, { text: 'An error occurred while fetching contacts.' }, { quoted: m });
    }
  }
};

export default contacts;
