import config from '../../config.cjs';
import fs from 'fs';
import { vCard } from 'vcf';  // Assuming you have a vcf library for vCards

const compileVCF = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "vcf") {
    // Simulate gathering contact info from the group
    const contacts = [
      { name: 'John Doe', phone: '+1234567890', email: 'john.doe@example.com' },
      { name: 'Jane Smith', phone: '+0987654321', email: 'jane.smith@example.com' }
    ];

    // Start compiling the VCF file
    const start = new Date().getTime();
    await m.React('⏳');  // Show the progress bar emoji as a start indicator

    const vcfData = contacts.map(contact => {
      const card = new vCard();
      card.add('fn', contact.name);
      card.add('tel', contact.phone);
      card.add('email', contact.email);
      return card.toString();
    }).join('\n');

    // Save the VCF file
    const filePath = './compiled_contacts.vcf';
    fs.writeFileSync(filePath, vcfData);

    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    // Simulate progress bar for "compiling"
    const progressBar = '▰▰▰▰▰▰▱▱▱▱';  // You can adjust this logic to simulate actual progress

    const text = `*VCF Compilation Complete ${progressBar} ${responseTime.toFixed(2)} ms*`;

    // Send the VCF file to the group
    sock.sendMessage(m.from, { 
      text, 
      attachment: fs.readFileSync(filePath)  // Attach the generated VCF file
    }, { quoted: m });
  }
}

export default compileVCF;
