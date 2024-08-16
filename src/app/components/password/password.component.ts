import { Component, Inject, OnDestroy, OnInit, Renderer2, VERSION } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { UserComponent } from '../user/user.component';
import { CustomHttpResponse } from 'src/app/model/performance/custom-http-response';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent extends UserComponent implements OnInit, OnDestroy {

  visible: boolean = true;
  changetype: boolean = true;
  luckyId: string;

  constructor(
    @Inject(DOCUMENT) document: Document,
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    private formBuilder: FormBuilder,
    primengConfig: PrimeNGConfig,
    messageService: MessageService,
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr,
      document,
      renderer2,
      primengConfig,
      messageService,
    );
  }

  name = 'Angular ' + VERSION.major;
  confirmPasswordClass = 'form-control';
  psw: string;
  whatComponent: string;
  public passTitle = new BehaviorSubject<string>('');
  public passTitleAction$ = this.passTitle.asObservable();

  /*
  * Falta alguna verificación con fechas para validar si ha expirado un plazo para definir una contraseña
  * (para reestablecer la contraseña da igual) moment.js etc
  */
  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe(() => {
        this.whatComponent = this.router.url.toString().substring(1, 5);
        if (this.passTitle.getValue() == '') { // prevent DynamicChangeDetector
          if (this.whatComponent == 'pass') {
            this.passTitle.next('Completar registro');
            this.luckyId = this.router.url.toString().substring(6, 23);
            console.log(this.luckyId);
          } else {
            this.passTitle.next('Cambio de contraseña');
            this.luckyId = this.router.url.toString().substring(12, 29);
          }
          console.log(this.luckyId);
          this.userService.getUserByUserId(this.luckyId).subscribe({
            next: (res: any) => {
              this.user = this.userService.performUser(res);
              this.notificationService.notify(NotificationType.SUCCESS, `Introduce tu nueva contraseña`);
              console.log(this.user);
            },
            error: (error: HttpErrorResponse) => {
              this.notificationService.notify(NotificationType.WARNING, error.error.message);
              this.refreshing = false;
              this.router.navigate(['/login']);
            }
          });
        }
      })
    );
  }

  onSubmit(): void {
    this.user.password = this.psw;
    console.log(this.user);
    if (this.whatComponent == 'pass') {
      this.subscriptions.push(
        this.userService.completeRegistry(this.user).subscribe({
          next: (res: CustomHttpResponse) => {
            console.log(res);
            this.notificationService.notify(NotificationType.SUCCESS, "Ahora puedes iniciar sesión :,>");
            this.refreshing = false;
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
          },
        })
      );
    } else {
      this.subscriptions.push(
        this.userService.saveNewPassword(this.user).subscribe({
          next: (res: User) => {
            this.notificationService.notify(NotificationType.SUCCESS, `Ya puedes iniciar sesión ` + res.firstname + `.`);
            this.refreshing = false;
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
          },
        })
      );
    }
  }

  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);


  resetPasswordForm = this.formBuilder.group(
    {
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    {
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword')
    } as AbstractControlOptions
  );

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }



  /*ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }*/

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
    console.log('funciona');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
