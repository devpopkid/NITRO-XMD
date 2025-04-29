import config from '../../config.cjs';
import fetch from 'node-fetch';

const movie = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'movie') {
    if (!text) {
      await sock.sendMessage(m.from, { text: '🍿 Please provide a movie name! Example: `.movie The Matrix` 🎬' }, { quoted: m });
      return;
    }

    await m.React('🔎'); // React with a magnifying glass while searching

    const apiKey = config.OMDb_API_KEY;
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=${apiKey}&plot=full`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        let movieInfo = `
🌟 *~ POPKID XMD MOVIE FINDER ~* 🌟

🎬 *Title:* ${data.Title} (${data.Year})
⭐ *IMDb Rating:* ${data.imdbRating} (${data.imdbVotes} votes)
🎭 *Genre:* ${data.Genre}
🗓️ *Released:* ${data.Released}
⏳ *Runtime:* ${data.Runtime}
👨‍Director:* ${data.Director}
✍️ *Writer(s):* ${data.Writer}
👨‍👩‍👧‍👦 *Cast:* ${data.Actors}
📜 *Plot:* ${data.Plot}
🌍 *Country:* ${data.Country}
🗣️ *Language(s):* ${data.Language}
🏆 *Awards:* ${data.Awards}
📦 *Box Office:* ${data.BoxOffice === 'N/A' ? 'Not Available' : data.BoxOffice}
📀 *DVD Release:* ${data.DVD === 'N/A' ? 'Not Available' : data.DVD}
🌐 *Website:* ${data.Website === 'N/A' ? 'Not Available' : data.Website}

🍿 Enjoy the show! 🍿
`;
        if (data.Poster && data.Poster !== 'N/A') {
          await sock.sendMessage(m.from, { image: { url: data.Poster }, caption: movieInfo }, { quoted: m });
        } else {
          await sock.sendMessage(m.from, { text: movieInfo }, { quoted: m });
        }
      } else {
        await sock.sendMessage(m.from, { text: `🚫 Movie not found! ${data.Error} 🚫` }, { quoted: m });
      }
      await m.React('✅'); // Indicate a successful movie found
    } catch (error) {
      console.error('💔 Error fetching movie data:', error);
      await sock.sendMessage(m.from, { text: '⚠️ An error occurred while searching for the movie. Please try again later. ⚠️' }, { quoted: m });
      await m.React('❌'); // Indicate a search failure due to an error
    }
  }
};

export default movie;
