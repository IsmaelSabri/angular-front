import { UserService } from '../service/user.service';
import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';
import { NotificationType } from '../class/notification-type.enum';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup } from '@angular/forms';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule, GoogleSigninButtonDirective } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];
  visible: boolean = true;
  changetype: boolean = true;
  registerForm: any = FormGroup;
  user:any;

  get f() {
    return this.registerForm.controls;
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private userService: UserService,
    config: NgbCarouselConfig,
    private socialAuthService: SocialAuthService,
  ) {
    config.interval = 2200;
    config.keyboard = true;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe({
        next: (response) => {
          localStorage.clear();
          console.log(response);
          this.authenticationService.saveToken(response.body.token);
          this.authenticationService.saveRefreshToken(
            response.body.refreshToken
          );
          const tokenPayload = this.authenticationService.decodedToken();
          this.userService.setFullName(tokenPayload.name);
          this.userService.setRole(tokenPayload.role);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/home');
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.showLoading = false;
        },
      })
    );
  }

  signInWithFB(): void {
      // falta el apikey de fc en módule
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  private sendErrorNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        'Algo salio mal. Por favor, inténtelo de nuevo.'
      );
    }
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
