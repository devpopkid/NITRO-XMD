import config from '../../config.cjs';
import { vcard } from '../../lib/converter.js'; // Assuming you have a vcard utility

const contacts = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "vcf") {
    if (!m.isGroup) {
      await m.reply('This command can only be used within a group.');
      return;
    }

    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      let vcfString = `BEGIN:VCARD\nVERSION:3.0\nFN:POPKID XMD contacts\n`;

      for (const participant of participants) {
        const userId = participant.id.split('@')[0];
        const pushName = participant.pushName || 'No Name'; // Get push name or default
        vcfString += `BEGIN:VCARD\nVERSION:3.0\nN:${pushName};;;\nFN:${pushName}\nTEL;TYPE=CELL;waid=${userId}:+${userId}\nEND:VCARD\n`;
      }

      vcfString += `END:VCARD`;

      await sock.sendMessage(
        m.from,
        {
          document: Buffer.from(vcfString),
          mimetype: 'text/vcard',
          fileName: 'POPKID XMD contacts.vcf',
        },
        { quoted: m }
      );

      await m.React('✅'); // Indicate success
    } catch (error) {
      console.error('Error compiling contacts:', error);
      await m.reply('An error occurred while compiling the contacts.');
      await m.React('❌'); // Indicate failure
    }
  }
};

export default contacts;
