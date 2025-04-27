import config from '../../config.cjs';
import { writeFileSync } from 'node:fs';

const createGroupVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "vcf") {
    try {
      if (!m.isGroup) {
        await sock.sendMessage(m.from, { text: 'This command is only usable within a group.' }, { quoted: m });
        return;
      }

      await sock.sendMessage(m.from, { text: 'popkid xmd is compiling your vcf, please wait 😊⭐' }, { quoted: m });
      // Removed m.React('⏳') as we are sending a waiting message

      const groupMetadata = await sock.groupMetadata(m.from);
      const vcfEntries = [];

      for (const participant of groupMetadata.participants) {
        const userId = participant.id.split(':')[0]; // Extracts the user ID
        const contact = await sock.fetchJidMetadata(userId);
        const displayName = contact?.name || userId; // Uses the display name if available, otherwise defaults to the user ID

        const vcfEntry = `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName}\nTEL;TYPE=CELL:${userId.replace('@s.whatsapp.net', '')}\nEND:VCARD\n`;
        vcfEntries.push(vcfEntry);
      }

      const vcfContent = vcfEntries.join('');
      const filename = `group_${groupMetadata.id.split('@')[0]}.vcf`;

      writeFileSync(filename, vcfContent);

      await sock.sendMessage(
        m.from,
        { document: { url: `./${filename}` }, mimetype: 'text/vcard', fileName: filename },
        { quoted: m }
      );

      await m.React('✅');
    } catch (error) {
      console.error('Error during VCF creation:', error);
      await sock.sendMessage(m.from, { text: 'An error occurred while generating the VCF file.' }, { quoted: m });
      await m.React('❌');
    }
  }
};

export default createGroupVCF;
