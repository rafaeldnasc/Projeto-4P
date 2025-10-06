import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonList, 
  IonIcon,
  IonBackButton,
  IonButtons,
  AlertController, 
  LoadingController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonIcon,
    IonBackButton,
    IonButtons
  ]
})
export class CadastroPage implements OnInit {
  cadastroForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.cadastroForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onCadastro() {
    if (this.cadastroForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Criando conta...',
      });
      await loading.present();

      // Simulação de cadastro
      setTimeout(async () => {
        await loading.dismiss();
        
        const userData = this.cadastroForm.value;
        console.log('Dados do usuário:', userData);
        
        this.showAlert('Sucesso', 'Conta criada com sucesso!');
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}