import config from '../../config.cjs';
import { vcard } from '@adiwajshing/baileys'; // Assuming you're using baileys

const createVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "vcf") {
    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const vcards = [];
      const emojis = '💚💛🧡💙💜';

      for (const participant of participants) {
        const contactName = `popkid${emojis} ${participant.id.split('@')[0]}`;
        const vcardString = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL;waid=${participant.id.split('@')[0]}:+${participant.id.split('@')[0]}\nEND:VCARD`;
        vcards.push(vcardString);
      }

      const vcfContent = vcards.join('\n');
      const fileName = `popkid_group_contacts_${new Date().toISOString().slice(0, 10)}.vcf`;

      await sock.sendMessage(
        m.from,
        {
          document: Buffer.from(vcfContent),
          mimetype: 'text/vcard',
          fileName: fileName,
        },
        { quoted: m }
      );

      await m.React('✅');
    } catch (error) {
      console.error("Error creating VCF:", error);
      await m.reply("An error occurred while creating the VCF.");
    }
  }
};

export default createVCF;
