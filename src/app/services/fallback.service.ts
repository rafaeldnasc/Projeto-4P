import { Injectable } from '@angular/core';

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  founded: number;
  venue: string;
  clubColors: string;
  area: { name: string };
  country: string;
  league: string;
}

@Injectable({
  providedIn: 'root'
})
export class FallbackService {

  private teamsData: { [key: string]: Team[] } = {
    PL: [
      { id: 1, name: 'Arsenal FC', shortName: 'Arsenal', tla: 'ARS', crest: 'https://crests.football-data.org/57.png', founded: 1886, venue: 'Emirates Stadium', clubColors: 'Vermelho / Branco', area: { name: 'England' }, country: 'Inglaterra', league: 'Premier League' },
      { id: 2, name: 'Chelsea FC', shortName: 'Chelsea', tla: 'CHE', crest: 'https://crests.football-data.org/61.png', founded: 1905, venue: 'Stamford Bridge', clubColors: 'Azul / Branco', area: { name: 'England' }, country: 'Inglaterra', league: 'Premier League' },
      { id: 3, name: 'Liverpool FC', shortName: 'Liverpool', tla: 'LIV', crest: 'https://crests.football-data.org/64.png', founded: 1892, venue: 'Anfield', clubColors: 'Vermelho / Branco', area: { name: 'England' }, country: 'Inglaterra', league: 'Premier League' },
      { id: 4, name: 'Manchester City', shortName: 'Man City', tla: 'MCI', crest: 'https://crests.football-data.org/65.png', founded: 1880, venue: 'Etihad Stadium', clubColors: 'Azul/ Branco', area: { name: 'England' }, country: 'Inglaterra', league: 'Premier League' },
      { id: 5, name: 'Manchester United', shortName: 'Man United', tla: 'MUN', crest: 'https://crests.football-data.org/66.png', founded: 1878, venue: 'Old Trafford', clubColors: 'Vermelho / Branco', area: { name: 'England' }, country: 'Inglaterra', league: 'Premier League' },
      { id: 6, name: 'Tottenham Hotspur', shortName: 'Tottenham', tla: 'TOT', crest: 'https://crests.football-data.org/73.png', founded: 1882, venue: 'Tottenham Hotspur Stadium', clubColors: 'Branco / Azul', area: { name: 'England' }, country: 'Inglaterra', league: 'Premier League' }
    ],
    PD: [
      { id: 7, name: 'FC Barcelona', shortName: 'Barcelona', tla: 'FCB', crest: 'https://crests.football-data.org/81.png', founded: 1899, venue: 'Spotify Camp Nou', clubColors: 'Vermelho/ Azul', area: { name: 'Spain' }, country: 'Espanha', league: 'La Liga' },
      { id: 8, name: 'Real Madrid CF', shortName: 'Real Madrid', tla: 'RMA', crest: 'https://crests.football-data.org/86.png', founded: 1902, venue: 'Estadio Santiago Bernabéu', clubColors: 'Branco / Roxo', area: { name: 'Spain' }, country: 'Espanha', league: 'La Liga' },
      { id: 9, name: 'Atlético de Madrid', shortName: 'Atlético Madrid', tla: 'ATM', crest: 'https://crests.football-data.org/78.png', founded: 1903, venue: 'Estadio Cívitas Metropolitano', clubColors: 'Vermelho / Branco / Azul', area: { name: 'Spain' }, country: 'Espanha', league: 'La Liga' },
      { id: 10, name: 'Sevilla FC', shortName: 'Sevilla', tla: 'SEV', crest: 'https://crests.football-data.org/559.png', founded: 1890, venue: 'Ramón Sánchez Pizjuán', clubColors: 'Branco / Vermelho', area: { name: 'Spain' }, country: 'Espanha', league: 'La Liga' },
      { id: 11, name: 'Valencia CF', shortName: 'Valencia', tla: 'VAL', crest: 'https://crests.football-data.org/95.png', founded: 1919, venue: 'Estadio de Mestalla', clubColors: 'Branco/ Preto', area: { name: 'Spain' }, country: 'Espanha', league: 'La Liga' }
    ],
    SA: [
      { id: 12, name: 'Juventus FC', shortName: 'Juventus', tla: 'JUV', crest: 'https://crests.football-data.org/109.png', founded: 1897, venue: 'Allianz Stadium', clubColors: 'Preto / Branco', area: { name: 'Italy' }, country: 'Italia', league: 'Serie A' },
      { id: 13, name: 'AC Milan', shortName: 'Milan', tla: 'MIL', crest: 'https://crests.football-data.org/98.png', founded: 1899, venue: 'San Siro', clubColors: 'Vermelho / Preto', area: { name: 'Italy' }, country: 'Italia', league: 'Serie A' },
      { id: 14, name: 'Inter Milan', shortName: 'Inter', tla: 'INT', crest: 'https://crests.football-data.org/108.png', founded: 1908, venue: 'San Siro', clubColors: 'Azul / Preto', area: { name: 'Italy' }, country: 'Italia', league: 'Serie A' },
      { id: 15, name: 'AS Roma', shortName: 'Roma', tla: 'ROM', crest: 'https://crests.football-data.org/100.png', founded: 1927, venue: 'Stadio Olimpico', clubColors: 'Vermelho / Laranja', area: { name: 'Italy' }, country: 'Italia', league: 'Serie A' },
      { id: 16, name: 'SSC Napoli', shortName: 'Napoli', tla: 'NAP', crest: 'https://crests.football-data.org/113.png', founded: 1926, venue: 'Diego Armando Maradona', clubColors: 'Azul / Branco', area: { name: 'Italy' }, country: 'Italia', league: 'Serie A' }
    ],
    BL1: [
      { id: 17, name: 'FC Bayern München', shortName: 'Bayern Munich', tla: 'FCB', crest: 'https://crests.football-data.org/5.png', founded: 1900, venue: 'Allianz Arena', clubColors: 'Vermelho / Branco', area: { name: 'Germany' }, country: 'Alemenha', league: 'Bundesliga' },
      { id: 18, name: 'Borussia Dortmund', shortName: 'Dortmund', tla: 'BVB', crest: 'https://crests.football-data.org/4.png', founded: 1909, venue: 'Signal Iduna Park', clubColors: 'Preto / Amarelo', area: { name: 'Germany' }, country: 'Alemenha', league: 'Bundesliga' },
      { id: 19, name: 'RB Leipzig', shortName: 'RB Leipzig', tla: 'RBL', crest: 'https://crests.football-data.org/721.png', founded: 2009, venue: 'Red Bull Arena', clubColors: 'Branco / Vermelho', area: { name: 'Germany' }, country: 'Alemenha', league: 'Bundesliga' },
      { id: 20, name: 'Bayer 04 Leverkusen', shortName: 'Leverkusen', tla: 'B04', crest: 'https://crests.football-data.org/3.png', founded: 1904, venue: 'BayArena', clubColors: 'Vermelho / Preto / Branco', area: { name: 'Germany' }, country: 'Alemenha', league: 'Bundesliga' }
    ],
    FL1: [
      { id: 21, name: 'Paris Saint-Germain', shortName: 'PSG', tla: 'PSG', crest: 'https://crests.football-data.org/524.png', founded: 1970, venue: 'Parc des Princes', clubColors: 'Vermelho / Azul / Branco', area: { name: 'France' }, country: 'França', league: 'Ligue 1' },
      { id: 22, name: 'Olympique de Marseille', shortName: 'Marseille', tla: 'OLM', crest: 'https://crests.football-data.org/516.png', founded: 1899, venue: 'Stade Vélodrome', clubColors: 'Branco / Azul', area: { name: 'France' }, country: 'França', league: 'Ligue 1' },
      { id: 23, name: 'AS Monaco', shortName: 'Monaco', tla: 'ASM', crest: 'https://crests.football-data.org/548.png', founded: 1924, venue: 'Stade Louis-II', clubColors: 'Vermelho / Branco', area: { name: 'France' }, country: 'França', league: 'Ligue 1' },
      { id: 24, name: 'Olympique Lyonnais', shortName: 'Lyon', tla: 'OL', crest: 'https://crests.football-data.org/523.png', founded: 1950, venue: 'Groupama Stadium', clubColors: 'Azul/ Branco / Vermelho', area: { name: 'France' }, country: 'França', league: 'Ligue 1' }
    ],
    BSA: [
      { id: 25, name: 'Flamengo', shortName: 'Flamengo', tla: 'FLA', crest: 'https://crests.football-data.org/1769.png', founded: 1895, venue: 'Maracanã', clubColors: 'Vermelho / Preto', area: { name: 'Brazil' }, country: 'Brasil', league: 'Brasileirão' },
      { id: 26, name: 'Palmeiras', shortName: 'Palmeiras', tla: 'PAL', crest: 'https://crests.football-data.org/1764.png', founded: 1914, venue: 'Allianz Parque', clubColors: 'Verde / Branco', area: { name: 'Brazil' }, country: 'Brasil', league: 'Brasileirão' },
      { id: 27, name: 'São Paulo FC', shortName: 'São Paulo', tla: 'SAO', crest: 'https://crests.football-data.org/1765.png', founded: 1930, venue: 'Morumbi', clubColors: 'Vermelho / Preto/ Branco', area: { name: 'Brazil' }, country: 'Brasil', league: 'Brasileirão' },
      { id: 28, name: 'Corinthians', shortName: 'Corinthians', tla: 'COR', crest: 'https://crests.football-data.org/1767.png', founded: 1910, venue: 'Neo Química Arena', clubColors: 'Preto / Branco', area: { name: 'Brazil' }, country: 'Brasil', league: 'Brasileirão' },
      { id: 29, name: 'Grêmio FBPA', shortName: 'Grêmio', tla: 'GRE', crest: 'https://crests.football-data.org/1768.png', founded: 1903, venue: 'Arena do Grêmio', clubColors: 'Azul / Preto / Branco', area: { name: 'Brazil' }, country: 'Brasil', league: 'Brasileirão' }
    ]
  };

  constructor() {}

  getTeams(leagueId: string): Team[] {
    return this.teamsData[leagueId] ?? [];
  }

  getRandomTeam(leagueId: string): Team | null {
    const teams = this.getTeams(leagueId);
    if (!teams || teams.length === 0) return null;
    const idx = Math.floor(Math.random() * teams.length);
    return teams[idx];
  }
}
