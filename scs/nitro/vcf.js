import config from '../../config.cjs';

const groupToVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "vcf" || cmd === "groupvcf") {
    if (!m.isGroup) {
      await sock.sendMessage(m.from, { text: 'This command can only be used in a group.' }, { quoted: m });
      return;
    }

    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const contacts = groupMetadata.participants.map(participant => {
        const number = participant.id.split(':')[0];
        let name = participant.pushName;

        // Improve fallback name if pushName is missing or just the number
        if (!name || name === number) {
          name = `Group Member (${number.split('@')[0]})`; // Use a more descriptive name
        }

        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${number.split('@')[0]}\nEND:VCARD`;
      });

      if (contacts.length === 0) {
        await sock.sendMessage(m.from, { text: 'No contacts found in this group.' }, { quoted: m });
        return;
      }

      const vcfContent = contacts.join('\n');
      const fileName = `${groupMetadata.subject.replace(/[^a-zA-Z0-9]/g, '_') || 'group_contacts'}.vcf`;

      await sock.sendMessage(
        m.from,
        {
          document: Buffer.from(vcfContent, 'utf-8'),
          mimetype: 'text/vcard',
          fileName: fileName,
        },
        { quoted: m }
      );
      await m.React('✅');
    } catch (error) {
      console.error("Error generating VCF:", error);
      await sock.sendMessage(m.from, { text: 'An error occurred while generating the VCF file.' }, { quoted: m });
      await m.React('❌');
    }
  }
};

export default groupToVCF;
