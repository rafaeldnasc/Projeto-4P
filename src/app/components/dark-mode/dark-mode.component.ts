import { Component, OnInit } from '@angular/core';
import { IonLabel, IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dark-mode',
  templateUrl: './dark-mode.component.html',
  styleUrls: ['./dark-mode.component.scss'],
  standalone: true,
  imports: [ IonLabel, IonToggle],
})
export class DarkToggleComponent {

  isDark = false;

  constructor() {
    this.isDark = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  toggleDarkMode(event: any) {
    this.isDark = event.detail.checked;
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDark) {
      document.documentElement.setAttribute('theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('theme');
      localStorage.setItem('theme', 'light');
    }
  }
}