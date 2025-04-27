import config from '../../config.cjs';
import axios from 'axios';

const football = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const API_KEY = 'Be994c67564c405595981645c43342c4';
  const BASE_URL = 'https://api.football-data.org/v4/';

  const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'X-Auth-Token': API_KEY },
  });

  const formatMatch = (match) => {
    const homeTeam = match.homeTeam?.name ?? 'N/A';
    const awayTeam = match.awayTeam?.name ?? 'N/A';
    const homeScore = match.score?.fullTime?.home ?? '-';
    const awayScore = match.score?.fullTime?.away ?? '-';
    const status = match.status;

    let scoreLine = '';
    if (status === 'FINISHED') {
      scoreLine = `⚽ *${homeScore} - ${awayScore}* 🥅`;
    } else if (status === 'LIVE') {
      scoreLine = `🔴 *LIVE* 🔴 (${homeScore} - ${awayScore})`;
    } else if (status === 'POSTPONED') {
      scoreLine = `❌ *POSTPONED* ❌`;
    } else if (status === 'SCHEDULED') {
      const matchTime = new Date(match.utcDate).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
      scoreLine = `⏰ ${matchTime} EAT`;
    } else {
      scoreLine = `Status: ${status}`;
    }

    return `*${homeTeam}* 🆚 *${awayTeam}*\n${scoreLine}\n`;
  };

  if (cmd === "football") {
    await m.React('⚽');

    if (!text) {
      await sock.sendMessage(m.from, { text: `⚽ Get football updates!\n\nUse commands like:\n${prefix}football live - See live matches\n${prefix}football today - See today's matches\n${prefix}football team [team name] - Get info about a team`, { quoted: m });
      return;
    }

    if (text.toLowerCase() === "live") {
      await sock.sendMessage(m.from, { text: '*Fetching Live Matches... 📡*' }, { quoted: m });
      try {
        const response = await api.get('matches', { params: { status: 'LIVE' } });
        const liveMatchesData = response.data?.matches;

        if (liveMatchesData && liveMatchesData.length > 0) {
          let message = "*Live Football Matches:*\n\n";
          liveMatchesData.forEach(match => {
            message += formatMatch(match);
          });
          await sock.sendMessage(m.from, { text: message }, { quoted: m });
        } else {
          await sock.sendMessage(m.from, { text: 'No live matches currently. 😴' }, { quoted: m });
        }
      } catch (error) {
        console.error("Error fetching live matches:", error);
        await sock.sendMessage(m.from, { text: 'Failed to fetch live match updates. ⚠️' }, { quoted: m });
      }
    } else if (text.toLowerCase() === "today") {
      const today = new Date().toISOString().slice(0, 10);
      await sock.sendMessage(m.from, { text: `*Fetching Today's Matches... 🗓️*` }, { quoted: m });
      try {
        const response = await api.get('matches', { params: { date: today } });
        const matchesTodayData = response.data?.matches;

        if (matchesTodayData && matchesTodayData.length > 0) {
          let message = `*Football Matches Today (${today}):*\n\n`;
          matchesTodayData.forEach(match => {
            message += formatMatch(match);
          });
          await sock.sendMessage(m.from, { text: message }, { quoted: m });
        } else {
          await sock.sendMessage(m.from, { text: 'No matches scheduled or completed today. 🤔' }, { quoted: m });
        }
      } catch (error) {
        console.error("Error fetching today's matches:", error);
        await sock.sendMessage(m.from, { text: 'Failed to fetch today\'s match information. ⚠️' }, { quoted: m });
      }
    } else if (text.toLowerCase().startsWith("team")) {
      const teamNameQuery = text.toLowerCase().split("team")[1].trim();
      if (teamNameQuery) {
        await sock.sendMessage(m.from, { text: `*Searching Team: ${teamNameQuery}... 🔍*` }, { quoted: m });
        try {
          const competitionsResponse = await api.get('competitions');
          const premierLeague = competitionsResponse.data?.competitions?.find(comp => comp.code === 'PL');

          if (premierLeague) {
            const teamsResponse = await api.get(`competitions/${premierLeague.id}/teams`);
            const foundTeam = teamsResponse.data?.teams?.find(team => team.name.toLowerCase().includes(teamNameQuery));

            if (foundTeam) {
              await sock.sendMessage(m.from, { text: `*Team Found (Premier League) 🏆:*\nName: ${foundTeam.name}\nShort Name: ${foundTeam.shortName}\nTLA: ${foundTeam.tla}\nCrest: ${foundTeam.crest}`, { quoted: m });
              return;
            }
          }
          await sock.sendMessage(m.from, { text: `No teams found matching "${teamNameQuery}" in the Premier League (PL). Try being more specific or try another league (you'd need to adjust the code). 🤷‍♂️` }, { quoted: m });

        } catch (error) {
          console.error(`Error fetching information about ${teamNameQuery}:`, error);
          await sock.sendMessage(m.from, { text: `Failed to fetch information about "${teamNameQuery}". ⚠️` }, { quoted: m });
        }
      } else {
        await sock.sendMessage(m.from, { text: 'Please specify the team name. ⚽' }, { quoted: m });
      }
    } else {
      await sock.sendMessage(m.from, { text: `⚽ Get football updates!\n\nUse commands like:\n${prefix}football live - See live matches\n${prefix}football today - See today's matches\n${prefix}football team [team name] - Get info about a team`, { quoted: m });
    }
  }
}

export default football;
