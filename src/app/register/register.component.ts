import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';
import { NotificationType } from '../class/notification-type.enum';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone:false
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];
  visible: boolean = true;
  changetype: boolean = true;

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/home');
    }
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    console.log(user);
    var json = JSON.stringify(user);
    this.subscriptions.push(
      this.authenticationService.register(json).subscribe({
        next: () => {
          this.showLoading = false;
          this.notificationService.notify(NotificationType.SUCCESS, `Se ha creado tu cuenta ${user.firstname + " " + user.lastname}.
          Verifica tu correo electrónico para acceder.`);
          this.router.navigateByUrl('/login');
          //this.clickButton('emailInfoModal');
        }, error: (errorResponse: HttpErrorResponse) => {
          var array = errorResponse.error.split('\n\n');
          this.notificationService.notify(NotificationType.ERROR, array[0]);
          setTimeout(() => {
            this.notificationService.notify(NotificationType.INFO, array[1]);
            setTimeout(() => {
              this.notificationService.notify(NotificationType.SUCCESS, array[2]);
            }, 1500);
          }, 1500);
          this.showLoading = false;
        }
      }
      )
    );
  }

  protected clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
