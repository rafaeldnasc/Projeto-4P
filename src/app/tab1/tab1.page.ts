import { Component } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonButton,
  IonCheckbox,
  IonLabel
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonButton,
    IonCheckbox,
    IonLabel
  ],
})
export class Tab1Page {

  constructor() {}
}