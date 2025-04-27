import config from '../../config.cjs';

const createVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "vcf") {
    if (!m.isGroup) {
      return m.reply("This command can only be used in groups.");
    }

    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata.participants;

      let vcfContent = "BEGIN:VCARD\nVERSION:3.0\n";
      participants.forEach(participant => {
        vcfContent += `TEL;type=CELL;waid=${participant.id.split('@')[0]}:+${participant.id.split('@')[0]}\n`;
      });
      vcfContent += "END:VCARD\n";

      // You might want to send this as a document with a .vcf extension
      await sock.sendMessage(
        m.from,
        {
          document: Buffer.from(vcfContent, 'utf-8'),
          mimetype: 'text/vcard',
          fileName: 'group_contacts.vcf',
        },
        { quoted: m }
      );
      await m.React('✅');
    } catch (error) {
      console.error("Error creating VCF:", error);
      await m.reply("An error occurred while trying to create the VCF.");
      await m.React('❌');
    }
  }
};

export default createVCF;
