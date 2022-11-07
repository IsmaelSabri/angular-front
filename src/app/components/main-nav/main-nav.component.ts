import { Edificio } from './../../model/edificio';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../class/notification-type.enum';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EdificioService } from '../../service/edificio.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css', 'bootstrap.min.css'],
})
export class MainNavComponent implements OnInit {

  edificio: Edificio = new Edificio();
  aux:string;
  public refreshing: boolean;


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
}
