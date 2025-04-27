import config from '../../config.cjs';

const createVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "groupvcf") {
    if (!m.isGroup) {
      return m.reply("This command can only be used in groups.");
    }

    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata.participants;

      let vcfContent = "BEGIN:VCARD\nVERSION:3.0\n";

      // Iterate through participants and use their usernames (display names)
      participants.forEach((participant, index) => {
        const username = participant.notify || `Popkid Contact ${index + 1}`; // Use the display name or fallback to default name
        const phoneNumber = participant.id.split('@')[0]; // Extract the phone number (WAID)

        // Add each contact's VCF entry with username
        vcfContent += `FN:${username} 📱\nTEL;type=CELL;waid=${phoneNumber}:+${phoneNumber}\n`;
      });

      vcfContent += "END:VCARD\n";

      // Send the VCF as a document with a .vcf extension
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
