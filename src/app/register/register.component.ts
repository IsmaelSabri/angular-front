import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';
import { NotificationType } from '../class/notification-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];
  visible:boolean = true;
  changetype:boolean =true;

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private notificationService: NotificationService) {}

  ngOnInit(): void { 
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/home');
    }
  }

  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  public onRegister(user:User): void {
    this.showLoading = true;
    console.log(user);
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe({
        next:() => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `Se ha creado tu cuenta ${user.firstname + " " + user.lastname}.
          Verifica tu correo electrónico para acceder.`);
          this.router.navigateByUrl('/login');
          //this.clickButton('emailInfoModal');
        },error:(errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      }
      )
  );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    console.log(message);
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Algo salio mal. Por favor, inténtelo de nuevo.');
    }
  }

  protected clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
