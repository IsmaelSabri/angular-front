import { UserService } from '../service/user.service';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';
import { NotificationType } from '../class/notification-type.enum';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { SocialAuthService, FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

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
  user: User;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  validateForm: FormGroup<{
    email: FormControl<string>;
  }>;

  get f() {
    return this.registerForm.controls;
  }

  isVisible: boolean = false;
  showDialog() {
    this.isVisible = true;
  }


  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private userService: UserService,
    config: NgbCarouselConfig,
    private socialAuthService: SocialAuthService,
    private fb: NonNullableFormBuilder
  ) {
    config.interval = 2200;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
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
          console.log(response.body);
          this.user = response.body;
          if (response.body.brandImageAsString != null || response.body.brandImageAsString != undefined) {
            this.user.brandImage = JSON.parse(this.user.brandImageAsString);
          }
          if (response.body.profileImageAsString != null || response.body.profileImageAsString != undefined) {
            this.user.profileImage = JSON.parse(this.user.profileImageAsString);
          }
          if (response.body.LikePreferencesAsString != null || response.body.LikePreferencesAsString != undefined) {
            this.user.likePreferences = JSON.parse(this.user.LikePreferencesAsString);
          }
          this.authenticationService.addUserToLocalCache(this.user);
          this.authenticationService.saveToken(response.body.token);
          this.authenticationService.saveRefreshToken(
            response.body.refreshToken
          );
          const tokenPayload = this.authenticationService.decodedToken();
          this.userService.setFullName(tokenPayload.name);
          this.userService.setRole(tokenPayload.role);
          this.router.navigateByUrl('/home');
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResponse.error);
          this.showLoading = false;
        },
      })
    );
  }

  protected submitForm(form: FormGroup) {
    this.showLoading=true
    var email = '';
    email = form.controls['email'].value;
    this.subscriptions.push(
      this.userService.checkEmailExists(email).subscribe({
        next: (response) => {
          if (response != null) {
            this.subscriptions.push(
              this.userService.resetPassword(response).subscribe({
                next: () => {
                  this.notificationService.notify(NotificationType.SUCCESS, `Revisa tu correo.`);
                  this.showLoading = false;
                },
                error: (error: HttpErrorResponse) => {
                  this.notificationService.notify(NotificationType.ERROR, error.error);
                  this.showLoading = false;
                }
              })
            )
          } else {
            this.notificationService.notify(NotificationType.INFO, "No existe una cuenta para " + email);
            this.showLoading = false;
          }
        },
        error: () => {
          this.notificationService.notify(NotificationType.ERROR, `No existe ninguna cuenta para ` + this.user.email);
          this.showLoading = false;
        },
      })
    );
  }

  signInWithFB(): void {
    // falta el apikey de fc en módule
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
