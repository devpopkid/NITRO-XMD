import config from '../../config.cjs';
import axios from 'axios';

const football = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const API_KEY = 'YOUR_FOOTBALL_DATA_ORG_API_KEY'; // **REPLACE THIS WITH YOUR ACTUAL API KEY**
  const BASE_URL = 'https://api.football-data.org/v4/'; // **VERIFY THIS BASE URL IN THE API DOCS**

  const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'X-Auth-Token': API_KEY }, // **CHECK IF THIS IS THE CORRECT AUTHENTICATION METHOD FOR YOUR API**
  });

  if (cmd === "football") {
    await m.React('⚽');

    if (!text) {
      await sock.sendMessage(m.from, { text: `Please specify what you're looking for. For example:\n${prefix}football live matches\n${prefix}football scores\n${prefix}football matches today` }, { quoted: m });
      return;
    }

    if (text.toLowerCase() === "live matches") {
      await sock.sendMessage(m.from, { text: '*Fetching live football matches...*' }, { quoted: m });
      try {
        const response = await api.get('matches', { // **VERIFY THE CORRECT ENDPOINT FOR LIVE MATCHES**
          params: {
            status: 'LIVE', // **CHECK IF THIS IS THE CORRECT PARAMETER FOR LIVE MATCHES**
          },
        });
        const liveMatchesData = response.data.matches; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**

        if (liveMatchesData && liveMatchesData.length > 0) {
          let message = "*Live Football Matches:*\n\n";
          liveMatchesData.forEach(match => {
            message += `*${match.homeTeam.name}* vs *${match.awayTeam.name}*\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
            message += `Score: ${match.score.fullTime.home} - ${match.score.fullTime.away}\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
            message += `Status: ${match.status}\n\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
          });
          await sock.sendMessage(m.from, { text: message }, { quoted: m });
        } else {
          await sock.sendMessage(m.from, { text: 'No live matches currently.' }, { quoted: m });
        }
      } catch (error) {
        console.error("Error fetching live matches:", error);
        await sock.sendMessage(m.from, { text: 'Failed to fetch live match updates.' }, { quoted: m });
      }
    } else if (text.toLowerCase() === "scores" || text.toLowerCase() === "matches today") {
      const today = new Date().toISOString().slice(0, 10);
      await sock.sendMessage(m.from, { text: `*Fetching today's football matches and scores...*` }, { quoted: m });
      try {
        const response = await api.get('matches', { // **VERIFY THE CORRECT ENDPOINT FOR TODAY'S MATCHES/SCORES**
          params: {
            date: today, // **CHECK IF 'date' IS THE CORRECT PARAMETER; SOME APIs MIGHT USE 'from' and 'to' for a date range**
          },
        });
        const matchesTodayData = response.data.matches; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**

        if (matchesTodayData && matchesTodayData.length > 0) {
          let message = `*Football Matches Today (${today}):*\n\n`;
          matchesTodayData.forEach(match => {
            message += `*${match.homeTeam.name}* vs *${match.awayTeam.name}*\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
            if (match.score.fullTime.home !== null && match.score.fullTime.away !== null) { // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
              message += `Score: ${match.score.fullTime.home} - ${match.score.fullTime.away}\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
            } else {
              message += `Status: ${match.status}\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
            }
            message += `Match Time: ${new Date(match.utcDate).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT\n\n`; // **ADJUST BASED ON THE ACTUAL RESPONSE STRUCTURE**
          });
          await sock.sendMessage(m.from, { text: message }, { quoted: m });
        } else {
          await sock.sendMessage(m.from, { text: 'No matches scheduled or completed today.' }, { quoted: m });
        }
      } catch (error) {
        console.error("Error fetching today's matches:", error);
        await sock.sendMessage(m.from, { text: 'Failed to fetch today\'s match information.' }, { quoted: m });
      }
    } else if (text.toLowerCase().startsWith("news about")) {
      const teamName = text.toLowerCase().split("news about")[1].trim();
      await sock.sendMessage(m.from, { text: `*Fetching news about ${teamName}...*` }, { quoted: m });
      await sock.sendMessage(m.from, { text: 'Sorry, fetching news directly from this API based on team name is not a standard feature. You might need to integrate with a separate news API or use a more general search.' }, { quoted: m }); // **THIS MIGHT CHANGE DEPENDING ON YOUR API**
    } else {
      await sock.sendMessage(m.from, { text: `I can help with:\n- Live matches (${prefix}football live matches)\n- Today's matches and scores (${prefix}football matches today)\n- Today's matches and scores (${prefix}football scores)` }, { quoted: m });
    }
  }
}

export default football;
