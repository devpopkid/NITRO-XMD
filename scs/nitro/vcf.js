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

      try {
        const groupMetadata = await sock.groupMetadata(m.from);
        if (!groupMetadata || !groupMetadata.participants) {
          await sock.sendMessage(m.from, { text: 'Error: Could not retrieve group information.' }, { quoted: m });
          await m.React('❌');
          return;
        }

        const vcfEntries = [];
        for (const participant of groupMetadata.participants) {
          try {
            const userId = participant.id.split(':')[0];
            const contact = await sock.fetchJidMetadata(userId);
            const displayName = contact?.name || userId;
            const phoneNumber = userId.replace('@s.whatsapp.net', '');
            const vcfEntry = `BEGIN:VCARD\nVERSION:3.0\nFN:${displayName}\nTEL;TYPE=CELL:${phoneNumber}\nEND:VCARD\n`;
            vcfEntries.push(vcfEntry);
          } catch (error) {
            console.error('Error fetching contact info for a participant:', error);
            // Optionally, inform the user that some contacts might be missing
          }
        }

        if (vcfEntries.length === 0) {
          await sock.sendMessage(m.from, { text: 'Error: No contact information found for group members.' }, { quoted: m });
          await m.React('❌');
          return;
        }

        const vcfContent = vcfEntries.join('');
        const filename = `group_${groupMetadata.id.split('@')[0]}.vcf`;

        try {
          writeFileSync(filename, vcfContent);
        } catch (error) {
          console.error('Error writing VCF file:', error);
          await sock.sendMessage(m.from, { text: 'Error: Could not save the VCF file.' }, { quoted: m });
          await m.React('❌');
          return;
        }

        await sock.sendMessage(
          m.from,
          { document: { url: `./${filename}` }, mimetype: 'text/vcard', fileName: filename },
          { quoted: m }
        );

        await m.React('✅');

      } catch (error) {
        console.error('Error during VCF creation process:', error);
        await sock.sendMessage(m.from, { text: 'An error occurred while generating the VCF file.' }, { quoted: m });
        await m.React('❌');
      }

    } catch (error) {
      console.error('General error in createGroupVCF:', error);
      await sock.sendMessage(m.from, { text: 'A critical error occurred.' }, { quoted: m });
      await m.React('❌');
    }
  }
};

export default createGroupVCF;
