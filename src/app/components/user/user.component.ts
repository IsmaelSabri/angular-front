import { BrandImage } from './../../model/user';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../class/notification-type.enum';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CustomHttpResponse } from '../../model/performance/custom-http-response';
import { AuthenticationService } from '../../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploadStatus } from '../../model/performance/file-upload.status';
import { Rol } from '../../class/role.enum';
import { ToastrService } from 'ngx-toastr';
import { APIKEY } from 'src/environments/environment.prod';
import { serialize } from 'object-to-formdata';

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
  public photoImage: File;
  protected subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername: string;
  public fileStatus = new FileUploadStatus();
  public showLoading: boolean;
  brandImageSrc: string = '';
  brandImageName: string;
  BrandImage: File;
  brandImageRefreshing: boolean;
  imageProfileRefreshing: boolean;

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(protected router: Router, protected authenticationService: AuthenticationService,
    protected userService: UserService, protected notificationService: NotificationService,
    protected route: ActivatedRoute, protected toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    //this.user.profileImage=JSON.parse(this.user.profileImageAsString);
    console.log(this.user);
    this.getUsers(true);
    //if(this.user.role=='USER_PRO'){}
  }

  get f() {
    return this.myForm.controls;
  }

  // brand image
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.brandImageName = event.target.files[0].name;
      this.BrandImage = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.brandImageSrc = reader.result as string;
        this.myForm.patchValue({
          fileSource: reader.result as string
        });
      };
    }
  }

  // brand image
  selectBrand(formDirective: FormGroupDirective) {
    var userUpdate = this.user;
    this.brandImageRefreshing = true;
    const body = new FormData();
    //imgbb cannot allow to delete images through api calls only manually so
    body.append('image', this.BrandImage);
    this.subscriptions.push(this.userService.uploadSignature(body, this.brandImageName)
      .subscribe({
        next: (res: any) => {
          userUpdate.brandImage = {
            imageId: res.data.data.id,
            imageName: res.data.data.title,
            imageUrl: res.data.data.url,
            imageDeleteUrl: res.data.data.delete_url
          }
          userUpdate.brandImageAsString = JSON.stringify(userUpdate.brandImage);
          formDirective.resetForm();
          this.brandImageSrc = '';
          this.subscriptions.push(this.userService.updateUser(userUpdate, userUpdate.id).subscribe({
            next: (res: any) => {
              console.log(res);
            },
            error: (err: any) => {
              console.log(err);
            }
          }));
          this.brandImageRefreshing = false;
          this.BrandImage=null;
          this.sendNotification(NotificationType.SUCCESS, `Imagen corporativa actualizada`);
        },
        error: (err: any) => {
          this.sendNotification(NotificationType.ERROR, `Algo salio mal. Por favor intentelo pasados unos minutos.`);
          this.brandImageRefreshing = false;
        }
      }));
  }

  public onUpdateCurrentUser(user: User): void {
    //console.log(user + ' image: ' + this.photoImage);
    this.refreshing = true;
    user.profileImageAsString=JSON.stringify(user.profileImage);
      this.subscriptions.push(this.userService.updateUser(user, user.id).subscribe({
        next: (res: any) => {
          console.log(res);
          
          this.refreshing = false;
          localStorage.removeItem('user');
          //this.authenticationService.addUserToLocalCache(res.body);
          this.photoImage=null;
          this.sendNotification(NotificationType.SUCCESS, `${res.firstname} ${res.lastname} Actualizado`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      }));
    }
  
    public onProfileImageChange(fileName: string, profileImage: File): void {
      this.fileName = fileName;
      this.imageProfileRefreshing = true;
      this.photoImage = profileImage;
      if (this.photoImage!=null) {
        const body = new FormData();
      body.append('image', this.photoImage);
      this.subscriptions.push(this.userService.uploadSignature(body, this.fileName)
        .subscribe({
          next: (res: any) => {
            this.user.profileImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            this.reportUploadProgress(res);
            console.log(res);
            console.log(this.user.profileImage);
            this.user.profileImageAsString = JSON.stringify(this.user.profileImage);
            //localStorage.removeItem('user');
            //localStorage.setItem('user', JSON.stringify(this.user));          
            this.imageProfileRefreshing = false;
          },
          error: (err: any) => {
            this.imageProfileRefreshing = false;
            console.log(err);
          }
        }));
      }
    }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe({
        next: (response: User[]) => {
          this.users = response;
          for (let i = 0; i < response.length; i++) {
            this.users[i].brandImage=JSON.parse(this.users[i].brandImageAsString);
            this.users[i].profileImage=JSON.parse(this.users[i].profileImageAsString);
          }
          this.userService.addUsersToLocalCache(response);
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} usuario(s).`);
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

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    //const formData = this.userService.a(null, userForm.value, this.photoImage);
    this.subscriptions.push(
      this.userService.addNewUser(userForm.value).subscribe({ // ? formdata
        next: () => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = null;
          this.photoImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Añadido con éxito`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.photoImage = null;
        }
      })
    );
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormData(this.currentUsername, this.editUser, this.photoImage);
    this.subscriptions.push(
      this.userService.updateUser(this.user, this.user.userId).subscribe({//this.user esta mal. es para probar por no comentar
        next: (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = null;
          this.photoImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstname} ${response.lastname} actualizado con éxito`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.photoImage = null;
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
          this.user.profileImage.imageUrl = `${event.body.data.url}?time=${new Date().getTime()}`;
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
    if (this.router.url === '/home'
    ) {
      this.sendNotification(NotificationType.SUCCESS, `Has cerrado sesión`);
      let timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      this.router.navigate(['/home']);
      this.sendNotification(NotificationType.SUCCESS, `Has cerrado sesión`);
    }
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

  public get isProUser(): boolean {
    return this.getUserRole() === Rol.USER_PRO;
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

  protected numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isEmptyArray(array: unknown): array is Array<unknown> {
    if (Array.isArray(array) && array.length) {
      return true;
    } else {
      return false;
    }
  }

  formatNumberWithCommas(n:Number):string{
    return JSON.stringify(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
