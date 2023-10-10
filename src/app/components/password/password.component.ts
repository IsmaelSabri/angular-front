import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { UserComponent } from '../user/user.component';
import { CustomHttpResponse } from 'src/app/model/performance/custom-http-response';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent
  extends UserComponent
  implements OnInit, OnDestroy
{
  visible: boolean = true;
  changetype: boolean = true;
  luckyId: string;

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr
    );
  }

  name = 'Angular ' + VERSION.major;
  passwordsMatching = false;
  isConfirmPasswordDirty = false;
  confirmPasswordClass = 'form-control';

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((res) => {
        this.luckyId = this.router.url.toString().substring(6, 23);
        console.log(this.luckyId);
        /*this.userService.checkEmailExists(this.luckyId).subscribe({
          next: (res:any)=>{
            if (res && res.length > 0) {
              
            }else{

            }
          }
        });*/
      })
    );
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
      validator: this.ConfirmedValidator('newPassword', 'confirmPassword'),
    }
  );

  ConfirmedValidator(controlName: string, matchingControlName: string) {
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
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
    console.log('funciona');
  }

  onSubmit(): void {
    console.log(this.resetPasswordForm);
    this.subscriptions.push(
      this.userService.completeRegistry(this.user).subscribe({
        next: (res: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, res.message);
          this.refreshing = false;
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      })
    );

    /*if (!this.resetPasswordForm?.valid) {
      return;
    }*/
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
