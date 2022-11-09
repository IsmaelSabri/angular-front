import { Edificio } from './../../model/edificio';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../class/notification-type.enum';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EdificioService } from '../../service/edificio.service';
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css', 'bootstrap.min.css'],
})
export class MainNavComponent implements OnInit {

  edificio: Edificio = new Edificio();
  aux:string;
  public refreshing: boolean;
  userContact:any; // data user array
  protected subscriptions: Subscription[] = [];


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private edificioService: EdificioService
  ) {}

  ngOnInit(): void {
    this.edificio=this.edificioService.edificio;
  }

  imprimir(){
    console.log(this.edificio);
  }

  private sendNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        'Error. Por favor inténtelo de nuevo.'
      );
    }
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(
      NotificationType.SUCCESS,
      `Te has desconectado correctamente`
    );
  }

  public contactMessage(){
    this.refreshing=true;
    const formData = new FormData();
    formData.append('nombre',this.contactMessage[0]);
    formData.append('apellido',this.contactMessage[1]);
    formData.append('correo',this.contactMessage[2]);
    formData.append('telefono',this.contactMessage[3]);
    formData.append('mensaje',this.contactMessage[4]);
    this.subscriptions.push(
     /*
     hay que crear un servicio de usuarios e implementar todo...
     
     this.markerService.addBuilding(formData).subscribe((res) => {
        this.router.navigate(['/home']),
          this.sendNotification(NotificationType.SUCCESS, ` Edificio creado.`);
        var resetForm = <HTMLFormElement>document.getElementById('markerForm');
        resetForm.reset();
        this.clickButton('new-marker-close');
      })*/
    );

  }




}
