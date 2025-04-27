import config from '../../config.cjs';
import { vcard } from 'wa-automate';

const createGroupVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "groupvcf") {
    await m.React('⏳');

    try {
      const groupMetadata = await sock.groupMetadata(m.from);
      const participants = groupMetadata?.participants || [];

      if (participants.length === 0) {
        await sock.sendMessage(m.from, { text: 'No participants found in this group.' }, { quoted: m });
        return;
      }

      let vcfString = '';
      for (const participant of participants) {
        const number = participant.id.split('@')[0];
        const name = participant.pushName || number; // Use pushName if available, otherwise use the number
        vcfString += vcard(name, number + '@s.whatsapp.net', 'WhatsApp Contact') + '\n';
      }

      const fileName = `group_${groupMetadata.id.split('@')[0]}.vcf`;
      await sock.sendMessage(
        m.from,
        {
          document: Buffer.from(vcfString),
          mimetype: 'text/vcard',
          fileName: fileName,
        },
        { quoted: m }
      );
      await m.React('✅');
    } catch (error) {
      console.error("Error creating VCF:", error);
      await sock.sendMessage(m.from, { text: 'An error occurred while creating the VCF.' }, { quoted: m });
      await m.React('❌');
    }
  }
};

export default createGroupVCF;
