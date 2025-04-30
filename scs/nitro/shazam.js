import fs from 'fs';
import acrcloud from 'acrcloud';
import config from '../../config.cjs';

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: '716b4ddfa557144ce0a459344fe0c2c9',
  access_secret: 'Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf'
});

const shazam = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['shazam', 'hansfind', 'whatmusic'];
    if (!validCommands.includes(cmd)) return;

    const quoted = m.quoted || {};

    if (!quoted || (quoted.mtype !== 'audioMessage' && quoted.mtype !== 'videoMessage')) {
      return m.reply('🎶 You want to identify music? Please quote an audio or video message with clear sound!');
    }

    const mime = quoted.mimetype;
    try {
      const media = await quoted.download();
      const filePath = `./${Date.now()}.mp3`;
      fs.writeFileSync(filePath, media);

      m.reply('🎧 Identifying the track, please wait a moment...');

      const res = await acr.identify(fs.readFileSync(filePath));
      const { code, msg } = res.status;

      if (code !== 0) {
        throw new Error(msg);
      }

      if (!res.metadata || !res.metadata.music || res.metadata.music.length === 0) {
        fs.unlinkSync(filePath);
        return m.reply('Hmm, I couldn\'t identify the music in that message.');
      }

      const track = res.metadata.music[0];
      const { title, artists, album, genres, release_date } = track;

      let artistString = artists ? artists.map(v => v.name).join(', ') : 'Not Found';
      let genreString = genres ? genres.map(v => v.name).join(', ') : 'Not Found';

      const txt = `🎶 **Track Found!** 🎶

🎵 **Title:** *${title || 'Not Found'}*
🎤 **Artist:** ${artistString}
💿 **Album:** ${album ? album.name : 'Not Found'}
🎼 **Genre:** ${genreString}
📅 **Released:** ${release_date || 'Not Found'}
      `.trim();

      fs.unlinkSync(filePath);
      m.reply(txt);

    } catch (error) {
      console.error(error);
      m.reply('⚠️ An error occurred while trying to identify the music.');
    }
  } catch (error) {
    console.error('Error:', error);
    m.reply('🚫 Something went wrong while processing your request.');
  }
};

export default shazam;
