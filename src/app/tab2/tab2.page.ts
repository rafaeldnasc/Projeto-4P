import { Component, OnInit } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonLabel, IonButton, AlertController, IonCardSubtitle, IonText, IonChip, IonSpinner, IonSegment, IonSegmentButton, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shirtOutline, trophyOutline, mapOutline, colorPaletteOutline, flagOutline, businessOutline, locationOutline, bulb, trophy} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from '../services/userdata.service';
import { FallbackService, Team } from '../services/fallback.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonIcon, IonLabel, IonButton, IonText, IonChip, IonSpinner, IonSegment, IonSegmentButton, CommonModule, IonInput]
})
export class Tab2Page implements OnInit {
  currentTeam: Team | null = null;
  currentHint: string = '';
  userGuess: string = '';
  otpLength: number = 1;
  attempts: number = 7;
  gameOver: boolean = false;
  won: boolean = false;
  isLoading: boolean = false;

  totalPoints$!: Observable<number>;

  leagues = [
    { id: 'PL', name: 'Premier League' },
    { id: 'PD', name: 'La Liga' },
    { id: 'SA', name: 'Serie A' },
    { id: 'BL1', name: 'Bundesliga' },
    { id: 'FL1', name: 'Ligue 1' },
    { id: 'BSA', name: 'Brasileirão' }
  ];

  selectedLeague: string = 'PL';

  // SUA API KEY - coloque aqui ou no environment
  private apiKey = environment.FOOBALL_API_KEY; // ← COLOCAR SUA CHAVE!

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private userData: UserDataService,
    private fallback: FallbackService
  ) {
    addIcons({ 
      shirtOutline, 
      trophyOutline, 
      mapOutline,
      colorPaletteOutline,
      flagOutline,
      businessOutline,
      locationOutline, 
      bulb,
      trophy
    });
  }

  ngOnInit() {
    console.log('🚀 Tab2 inicializado');
    this.totalPoints$ = this.userData.totalPoints$;
    this.loadRandomTeam();
  }

  async loadRandomTeam() {
    this.isLoading = true;
    console.log(`⚽ Buscando times da ${this.getLeagueName()}...`);
    
    try {
      const url = `/v4/competitions/${this.selectedLeague}/teams`;

      console.log('🌐 Chamando API:', url);
      
      const response = await fetch(url, {
        headers: {
          'X-Auth-Token': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${data.teams?.length || 0} times recebidos`);
      
      if (data.teams && data.teams.length > 0) {
        // Seleciona time aleatório
        const randomIndex = Math.floor(Math.random() * data.teams.length);
        const apiTeam = data.teams[randomIndex];
        
        // Converte para formato do seu Team
        this.currentTeam = {
          id: apiTeam.id,
          name: apiTeam.name,
          shortName: apiTeam.shortName || apiTeam.name,
          tla: apiTeam.tla || apiTeam.shortName?.substring(0, 3).toUpperCase() || 'TLA',
          crest: apiTeam.crest || `https://crests.football-data.org/${apiTeam.id}.png`,
          founded: apiTeam.founded || 1900,
          venue: apiTeam.venue || 'Estádio desconhecido',
          clubColors: apiTeam.clubColors || 'Preto / Branco',
          area: { name: apiTeam.area?.name || 'Desconhecido' },
          country: this.getCountryFromArea(apiTeam.area?.name),
          league: this.getLeagueName()
        };
        
        this.otpLength = 3;
        this.resetGame();
        
        console.log('🎯 Time selecionado:', this.currentTeam.name);
        console.log('📊 Dados:', {
          id: this.currentTeam.id,
          país: this.currentTeam.country,
          estádio: this.currentTeam.venue,
          fundado: this.currentTeam.founded
        });
        
      } else {
        console.warn('⚠️ API retornou sem times, usando fallback');
        this.useFallback();
      }
      
    } catch (error) {
      console.error('❌ Erro na API:', error);
      console.log('🔄 Usando fallback...');
      this.useFallback();
      
    } finally {
      this.isLoading = false;
    }
  }

  private getCountryFromArea(areaName: string): string {
    const countryMap: {[key: string]: string} = {
      'England': 'Inglaterra',
      'Spain': 'Espanha',
      'Italy': 'Itália',
      'Germany': 'Alemanha',
      'France': 'França',
      'Brazil': 'Brasil',
      'Portugal': 'Portugal',
      'Netherlands': 'Holanda'
    };
    return countryMap[areaName] || areaName || 'Desconhecido';
  }

  private useFallback() {
    const fb = this.fallback.getRandomTeam(this.selectedLeague);
    if (fb) {
      this.currentTeam = fb;
      this.otpLength = 3;
      this.resetGame();
      console.log('📦 Usando fallback:', fb.name);
    } else {
      console.error('💀 Sem dados disponíveis!');
      // Pode mostrar um alerta ao usuário
    }
  }

  // =========================
  // DICAS (mantenha seu código atual)
  // =========================
  showHint(type: string) {
    if (!this.currentTeam) return;

    switch(type) {
      case 'colors':
        this.currentHint = `🎨 Cores: ${this.currentTeam.clubColors}`;
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
    // Mantenha seu código atual
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
  // INPUT E RESPOSTA (mantenha seu código)
  // =========================
  onInputChange(event: any) {
    this.userGuess = event.detail.value.toUpperCase();
  }

  normalizeTeamName(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\b([a-z]{2,4})\b/g, "")
      .replace(/\b(f|c|s)?(fc|cf|sc|afc|acf|ec|ac|as|de|da|do|the)\b/g, "")
      .replace(/\b(fc|cf|sc|ec|ac|afc)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  cleanTeamName(name: string): string {
    return name
      .replace(/\(.*?\)/g, "")
      .replace(/\b([A-Z]{2,4})\b/g, "")
      .replace(/\b\d+\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async checkAnswer() {
    if (!this.currentTeam || this.gameOver) return;

    const correctName = this.normalizeTeamName(this.currentTeam.name);
    const guess = this.normalizeTeamName(this.userGuess);

    if (guess === correctName) {
      this.won = true;
      this.gameOver = true;

      const earnedPoints = this.attempts * 10;

      await this.userData.addVictory();
      await this.userData.addPoints(earnedPoints);

      const alert = await this.alertController.create({
        header: '🎉 Parabéns!',
        message: `Você acertou! O time era ${this.cleanTeamName(this.currentTeam.name)}. +${earnedPoints} pontos!`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.attempts--;

    if (this.attempts <= 0) {
      this.gameOver = true;
      await this.userData.addLoss();

      const alert = await this.alertController.create({
        header: '💀 Fim de jogo!',
        message: `O time era ${this.cleanTeamName(this.currentTeam.name)}.`,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

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

    const hints = [
      `🎨 Cores: ${this.currentTeam.clubColors}`,
      `🏟️ Estádio: ${this.currentTeam.venue}`,
      `📅 Fundado em: ${this.currentTeam.founded}`,
      `🏴 País: ${this.currentTeam.country}`,
      `🏙️ Cidade: ${this.getCityFromVenue(this.currentTeam.venue)}`
    ];

    this.currentHint = hints[Math.floor(Math.random() * hints.length)];
  }

  resetGame() {
    this.userGuess = '';
    this.currentHint = '';
    this.attempts = 5;
    this.gameOver = false;
    this.won = false;
  }

  changeLeague(event: any) {
    this.selectedLeague = event.detail.value;
    this.loadRandomTeam();
  }

  getLeagueName(): string {
    return this.leagues.find(l => l.id === this.selectedLeague)?.name || 'Liga';
  }
}

