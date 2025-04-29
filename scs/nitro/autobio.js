import config from '../../config.cjs';
 import moment from 'moment-timezone';
 

 // 🌟 Array of ✨ Fancy ✨ Life Quotes 📜
 const lifeQuotes = [
   "💖 The only way to do great work is to love what you do. ❤️‍🔥",
   "💫 Strive not to be a success, but rather to be of ✨ value ✨. 💎",
   "🧠 The mind is everything. What you think 💭 you become. 🔮",
   "🌠 Believe you can and you're halfway there! 🏆",
   "🌌 The future belongs to those who believe in the beauty of their dreams. 🦢",
   "🕰️ It is never too late to be what you might have been. 🦋💫",
   "💥 Do not wait to strike till the iron is hot; but 🔥 make 🔥 the iron hot by striking! ⚡",
   "🎨 The best way to predict the future is to ✍️ create ✍️ it. 🌈",
   "🚶‍♂️ The journey of a thousand miles begins with a ✨ single ✨ step. 🏞️👣",
   "😊 Happiness is not something readymade. It comes from your own actions. 😄🌟"
 ];
 

 const updateBio = async (sock) => {
   try {
     const kenyaTime = moment().tz('Africa/Nairobi').format('HH:mm:ss');
     const randomIndex = Math.floor(Math.random() * lifeQuotes.length);
     const randomQuote = lifeQuotes[randomIndex];
     const newBio = `✨🚀 POPKID XMD IS ✨ ACTIVE ✨ 🟢 | 🕰️ Kenya Time: ${kenyaTime} 🇰🇪 | 💬 "${randomQuote}" 📜`;
     await sock.updateProfileStatus(newBio);
     console.log('✅✨ Auto Bio Updated! ✨✅:', newBio);
   } catch (error) {
     console.error('❌⚠️ Auto Bio Update Failed! ⚠️❌:', error);
   }
 };
 

 const autobioOnConnect = async (sock) => {
   if (!sock.user?.id) {
     console.warn('⚠️ Bot user information not available on connect.');
     return;
   }
   await updateBio(sock);
 };
 

 const autobioCommand = async (m, sock) => {
   const prefix = config.PREFIX;
   const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
   let bioUpdateInterval = global.bioUpdateInterval || null; // Access global interval
 

   if (cmd === "autobio") {
     if (!sock.user?.id) {
       await sock.sendMessage(m.from, { text: '🤖✨ Bot Info Unavailable! ⚠️ Please try again later. 🙏' }, { quoted: m });
       return;
     }
 

     if (bioUpdateInterval) {
       clearInterval(bioUpdateInterval); // 🛑 Stop the bio updates 🛑
       global.bioUpdateInterval = null; // Clear global interval
       await sock.sendMessage(m.from, { text: '😴 Automatic bio updates (timer) have been stopped. 💤' }, { quoted: m });
     } else {
       // 🚀 Initial bio update! 🚀 (This will run immediately on command)
       await updateBio(sock);
 

       // ⏳ Set interval to update bio every minute (adjust as needed) ⏳
       global.bioUpdateInterval = setInterval(() => updateBio(sock), 60000); // ⏱️ 60000 ms = 1 minute ⏱️
 

       await sock.sendMessage(m.from, { text: '🎉 Automatic bio updates (timer) started! ✨ Let the magic happen! ✨' }, { quoted: m });
     }
   }
 };
 

 export { autobioCommand, autobioOnConnect };
