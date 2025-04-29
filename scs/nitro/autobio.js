 import config from '../../config.cjs';
 import moment from 'moment-timezone';
 

 // Array of life quotes
 const lifeQuotes = [
   "The only way to do great work is to love what you do.",
   "Strive not to be a success, but rather to be of value.",
   "The mind is everything. What you think you become.",
   "Believe you can and you're halfway there.",
   "The future belongs to those who believe in the beauty of their dreams.",
   "It is never too late to be what you might have been.",
   "Do not wait to strike till the iron is hot; but make the iron hot by striking.",
   "The best way to predict the future is to create it.",
   "The journey of a thousand miles begins with a single step.",
   "Happiness is not something readymade. It comes from your own actions."
 ];
 

 let bioUpdateInterval = null; // Store the interval ID
 

 const autobio = async (m, sock) => {
   const prefix = config.PREFIX;
   const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
 

   if (cmd === "autobio") {
     if (!sock.user?.id) {
       await sock.sendMessage(m.from, { text: 'Bot user information not available.' }, { quoted: m });
       return;
     }
 

     const updateBio = async () => {
       try {
         const kenyaTime = moment().tz('Africa/Nairobi').format('HH:mm:ss');
         const randomIndex = Math.floor(Math.random() * lifeQuotes.length);
         const randomQuote = lifeQuotes[randomIndex];
         const newBio = `POPKID XMD IS ACTIVE | Time: ${kenyaTime} | "${randomQuote}"`;
         await sock.updateProfileStatus(newBio);
         console.log('Bio updated successfully:', newBio);
       } catch (error) {
         console.error('Error updating bio:', error);
       }
     };
 

     if (bioUpdateInterval) {
       clearInterval(bioUpdateInterval); // Clear any existing interval
       bioUpdateInterval = null;
       await sock.sendMessage(m.from, { text: 'Automatic bio update stopped.' }, { quoted: m });
     } else {
       // Initial update
       await updateBio();
 

       // Set interval to update bio every minute (you can adjust this)
       bioUpdateInterval = setInterval(updateBio, 60000); // 60000 milliseconds = 1 minute
 

       await sock.sendMessage(m.from, { text: 'Automatic bio update started!' }, { quoted: m });
     }
   }
 };
 

 export default autobio;
