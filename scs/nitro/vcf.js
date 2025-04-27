import config from '../../config.cjs';

const groupToVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "grovcf" || cmd === "groupvcf") {
    if (!m.isGroup) {
      await sock.sendMessage(m.from, { text: 'This command can only be used within a group.' }, { quoted: m });
      return;
    }

    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const contacts = groupMetadata.participants.map(async (participant) => {
        const number = participant.id.split(':')[0];
        let name = participant.pushName;

        // Attempt to fetch user information to get a potentially more accurate name
        try {
          const user = await sock.getUser(participant.id);
          if (user?.name) {
            name = user.name;
          }
        } catch (error) {
          console.warn(`Could not fetch user info for ${number}:`, error);
          // Fallback to pushName or a generic name if fetching fails
          name = name || `Group Member (${number.split('@')[0]})`;
        }

        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${number.split('@')[0]}\nEND:VCARD`;
      });

      const resolvedContacts = await Promise.all(contacts);

      if (resolvedContacts.length === 0) {
        await sock.sendMessage(m.from, { text: 'There are no contacts to export in this group.' }, { quoted: m });
        return;
      }

      const vcfContent = resolvedContacts.join('\n');
      const fileName = "popkid XMD.vcf";

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
      console.error("An error occurred while generating the VCF:", error);
      await sock.sendMessage(m.from, { text: 'Oops! Something went wrong while creating the VCF file.' }, { quoted: m });
      await m.React('❌');
    }
  }
};

export default groupToVCF;
