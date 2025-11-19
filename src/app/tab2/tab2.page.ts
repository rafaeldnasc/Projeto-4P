import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonButton,
  AlertController,
  IonCardSubtitle,
  IonText,
  IonChip,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonInput
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  shirtOutline, 
  trophyOutline, 
  mapOutline, 
  colorPaletteOutline,
  flagOutline,
  businessOutline,
  calendarOutline,
  locationOutline,
  bulbOutline,
  trophy,
  sad
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserDataService } from '../services/user-data.service';


// =========================
// INTERFACES
// =========================
interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  founded: number;
  venue: string;
  clubColors: string;
  area: {
    name: string;
  };
  country: string;
  league: string;
}

interface CompetitionResponse {
  teams: Team[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonIcon,
    IonLabel,
    IonButton,
    IonText,
    IonChip,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    CommonModule,
    HttpClientModule,
    IonInput
  ]
})
export class Tab2Page implements OnInit {

  // ------------------------
  // VARIÁVEIS DO JOGO
  // ------------------------
  currentTeam: Team | null = null;
  currentHint: string = '';
  userGuess: string = '';
  otpLength: number = 1;
  attempts: number = 7;
  gameOver: boolean = false;
  won: boolean = false;
  isLoading: boolean = false;
  score: number = 0;

  leagues = [
    { id: 'PL', name: 'Premier League' },
    { id: 'PD', name: 'La Liga' },
    { id: 'SA', name: 'Serie A' },
    { id: 'BL1', name: 'Bundesliga' },
    { id: 'FL1', name: 'Ligue 1' },
    { id: 'BSA', name: 'Brasileirão' }
  ];

  selectedLeague: string = 'PL';

  // Base de dados completa com times reais
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

  private apiUrl = 'https://api.football-data.org/v4';
  private apiKey = environment.FOOBALL_API_KEY; 

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private userData: UserDataService 
  ) {
    addIcons({ 
      shirtOutline, 
      trophyOutline, 
      mapOutline,
      colorPaletteOutline,
      flagOutline,
      businessOutline,
      calendarOutline,
      locationOutline,
      bulbOutline,
      trophy,
      sad
    });
  }
  
usedHints = {
  colors: false,
  country: false,
  stadium: false,
  founded: false,
  city: false
};

  // =========================
  // INICIALIZAÇÃO
  // =========================
  ngOnInit() {
    this.loadRandomTeam();
  }

  // =========================
  // CARREGA TIME ALEATÓRIO
  // =========================
  async loadRandomTeam() {
  this.isLoading = true;

  try {
    const headers = new HttpHeaders({
      'X-Auth-Token': this.apiKey
    });

    this.http.get<CompetitionResponse>(
  `/api/competitions/${this.selectedLeague}/teams`,
  { headers }
  ).subscribe({
      next: (response) => {
        const teams = response.teams;
        if (teams && teams.length > 0) {
          const randomIndex = Math.floor(Math.random() * teams.length);
          this.currentTeam = teams[randomIndex];
          this.otpLength = 3; 
          this.resetGame();
        } else {
          this.useFallbackData();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log("Erro na API:", err);
        this.useFallbackData();
        this.isLoading = false;
      }
    });

  } catch (error) {
    this.useFallbackData();
    this.isLoading = false;
  }
}


  // =========================
  // FALLBACK SE API FALHAR
  // =========================
  useFallbackData() {
    const teams = this.teamsData[this.selectedLeague];
    if (teams && teams.length > 0) {
      const randomIndex = Math.floor(Math.random() * teams.length);
      this.currentTeam = teams[randomIndex];
      this.otpLength = 3;
      this.resetGame();
    }
  }

  // =========================
  // DICAS
  // =========================
  showHint(type: string) {
    if (!this.currentTeam) return;

    switch(type) {
      case 'colors':
        this.currentHint = `🎨 Cor da camisa: ${this.currentTeam.clubColors}`;
        break;
      case 'country':
        this.currentHint = `🏴 País: ${this.currentTeam.country}`;
        break;
      case 'stadium':
        this.currentHint = `🏟️ Estádio: ${this.currentTeam.venue}`;
        break;
      case 'founded':
        this.currentHint = `📅 Fundado em: ${this.currentTeam.founded}`;
        break;
      case 'city':
        const city = this.getCityFromVenue(this.currentTeam.venue);
        this.currentHint = `🏙️ Cidade: ${city}`;
        break;
    }
  }

  getCityFromVenue(venue: string): string {
    const cities: {[key: string]: string} = {
      'Old Trafford': 'Manchester',
      'Anfield': 'Liverpool',
      'Emirates': 'Londres',
      'Stamford': 'Londres',
      'Etihad': 'Manchester',
      'Camp Nou': 'Barcelona',
      'Bernabéu': 'Madrid',
      'Metropolitano': 'Madrid',
      'San Siro': 'Milão',
      'Allianz Arena': 'Munique',
      'Maracanã': 'Rio de Janeiro',
      'Morumbi': 'São Paulo',
      'Parc des Princes': 'Paris',
      'Vélodrome': 'Marseille',
      'Signal':'Dortmund',
      'Allianz Parque': 'São Paulo',
      'Grêmio': 'Rio Grande do Sul',
      'Diego' : 'Napoles',
      'Tottenham Hotspur Stadium': 'Londres',
      'Stadio':'Roma',
      'Allianz Stadium': 'Turim',
      'Groupama': 'Lyon',
      'Stade Louis-II': 'Monaco',
      'BayArena':'Leverkusen',
      'Red Bull':'Leipzig',
      'Estadio de Mestalla': 'Valencia',
      'Ramón': 'Sevilla'
    };

    for (const [key, city] of Object.entries(cities)) {
      if (venue.includes(key)) {
        return city;
      }
    }
    return 'Cidade desconhecida';
  }

  // =========================
  // INPUT DO USUÁRIO
  // =========================
  onInputChange(event: any) {
    this.userGuess = event.detail.value.toUpperCase();
  }

  // =========================
// NORMALIZA O NOME (remove FC, CF, SC, etc)
// =========================
normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-zA-ZÀ-ú0-9\s]/g, "") 
    .replace(/\b(fc|cf|sc|afc|ec|ac|de|da|do|the)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


  // =========================
  // VERIFICA A RESPOSTA
  // =========================
    async checkAnswer() {
    if (!this.currentTeam || this.gameOver) return;

    const correctName = this.normalizeTeamName(this.currentTeam.name);
    const guess = this.normalizeTeamName(this.userGuess);

    // =========================
    // ✔️ JOGADOR ACERTOU
    // =========================
    if (guess === correctName) {
      this.won = true;
      this.gameOver = true;
      
      const earnedPoints = this.attempts * 10;

      // 🔥 Atualiza no Firestore
      await this.userData.addVictory();
      await this.userData.addPoints(earnedPoints);

      const alert = await this.alertController.create({
        header: '🎉 Parabéns!',
        message: `Você acertou! O time era ${this.currentTeam.shortName}. +${earnedPoints} pontos!`,
        buttons: ['OK']
      });
      await alert.present();

      return;
    }

    // =========================
    // ❌ ERROU A RESPOSTA
    // =========================
    this.attempts--;

    // =========================
    // 💀 FIM DE JOGO — PERDEU
    // =========================
    if (this.attempts <= 0) {
      this.gameOver = true;

      // 🔥 Atualiza derrota no Firestore
      await this.userData.addLoss();

      const alert = await this.alertController.create({
        header: '💀 Fim de jogo!',
        message: `O time era ${this.currentTeam.shortName} (${this.currentTeam.tla}).`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // =========================
    // ❌ ERRO NORMAL — AINDA TEM TENTATIVAS
    // =========================
    let hintMessage = `❌ Errado! ${this.attempts} tentativa(s) restante(s).`;

    if (this.attempts === 2) {
      hintMessage += ` Dica: País: ${this.currentTeam.country}`;
    } else if (this.attempts === 1) {
      hintMessage += ` Cidade: ${this.getCityFromVenue(this.currentTeam.venue)}`;
    }

    const alert = await this.alertController.create({
      header: 'Tente novamente!',
      message: hintMessage,
      buttons: ['OK']
    });
    await alert.present();
  }

onCardClick() {
  if (!this.currentTeam || this.gameOver) return;

  // Escolhe uma dica automática
  const hints = [
    `🎨 Cores: ${this.currentTeam.clubColors}`,
    `🏟️ Estádio: ${this.currentTeam.venue}`,
    `📅 Fundado em: ${this.currentTeam.founded}`,
    `🏴 País: ${this.currentTeam.country}`,
    `🏙️ Cidade: ${this.getCityFromVenue(this.currentTeam.venue)}`
  ];

  // Seleciona uma dica aleatória
  this.currentHint = hints[Math.floor(Math.random() * hints.length)];
}



  // =========================
  // RESETAR O JOGO
  // =========================
  resetGame() {
    this.userGuess = '';
    this.currentHint = '';
    this.attempts = 5;
    this.gameOver = false;
    this.won = false;
  }

  // =========================
  // TROCA DE LIGA
  // =========================
  changeLeague(event: any) {
    this.selectedLeague = event.detail.value;
    this.loadRandomTeam();
  }

  // =========================
  // PEGAR ESCUDO
  // =========================


  // =========================
  // PEGAR NOME DA LIGA
  // =========================
  getLeagueName(): string {
    return this.leagues.find(l => l.id === this.selectedLeague)?.name || 'Liga';
  }

  

}