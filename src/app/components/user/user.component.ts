import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../class/notification-type.enum';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CustomHttpResponse } from '../../model/performance/custom-http-response';
import { AuthenticationService } from '../../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadStatus } from '../../model/performance/file-upload.status';
import { Rol } from '../../class/role.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Usuarios');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[];
  public user: User;
  public refreshing: boolean;
  public selectedUser: User;
  public fileName: string;
  public propertyImage: File;
  protected subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername: string;
  public fileStatus = new FileUploadStatus();
  public showLoading: boolean;


  constructor(protected router: Router, protected authenticationService: AuthenticationService,
    protected userService: UserService, protected notificationService: NotificationService,
    protected route: ActivatedRoute, protected toastr: ToastrService) { }

  ngOnInit(): void {
    //console.log(this.user.isactive);
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe({
        next: (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} usuario(s) cargados con éxito.`);
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      })
    );

  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.propertyImage = profileImage;
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    //const formData = this.userService.createUserFormDate(null, userForm.value, this.propertyImage);
    this.subscriptions.push(
      this.userService.addNewUser(userForm.value).subscribe({ // ? formdata
        next: () => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = null;
          this.propertyImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Añadido con éxito`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.propertyImage = null;
        }
      })
    );
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.propertyImage);
    this.subscriptions.push(
      this.userService.updateUser(formData, this.user.userId).subscribe({
        next: (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = null;
          this.propertyImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstname} ${response.lastname} actualizado con éxito`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.propertyImage = null;
        }
      })
    );
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().firstname;
    const formData = this.userService.createUserFormDate(this.currentUsername, user, this.propertyImage);
    this.subscriptions.push(
      this.userService.updateUser(formData, user.userId).subscribe({
        next: (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.getUsers(false);
          this.fileName = null;
          this.propertyImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstname} ${response.lastname} actualizado con éxito`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
          this.propertyImage = null;
        }
      })
    );
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.propertyImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe({
        next: (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      })
    );
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.fotoPerfilUrl = `${event.body.fotoPerfilUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.primerApellido}\' foto de perfil actualizada con éxito`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.sendNotification(NotificationType.ERROR, `No se puede subir la imagen. Por favor vuelva a intentarlo.`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/home']);
    window.location.reload();
    this.sendNotification(NotificationType.SUCCESS, `Has cerrado sesión`);
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe({
        next: (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
          () => emailForm.reset()
        },
        error: (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        }
      },
      )
    );
  }

  public onDeleteUser(id: string): void {
    //console.log(username);
    this.subscriptions.push(
      this.userService.deleteUser(id).subscribe({
        next: (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
        },
        error: (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      })
    );
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (user.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastname.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Rol.ADMIN || this.getUserRole() === Rol.GOD;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Rol.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  protected sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Error. Por favor inténtelo de nuevo.');
    }
  }

  protected clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
