import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { PrimeNGConfig } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/model/user';
import { Home } from 'src/app/model/home';
//declare function printLogger(any);

@Component({
  selector: 'app-user-pro',
  templateUrl: './user-pro.component.html',
  styleUrl: './user-pro.component.css'
})
export class UserProComponent extends UserComponent implements OnInit, OnDestroy {

  userUpdate: User = new User();
  homes: Home[] = [];

  constructor(
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    protected modalService: BsModalService,
    @Inject(DOCUMENT) protected document: Document,
    protected sanitizer: DomSanitizer,
    primengConfig: PrimeNGConfig
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
      primengConfig
    );
  }

  protected styleUser: HTMLLinkElement[] = [];
   cssPath = [
    '../../../assets/css/bootstrap.min.css',
    'https://cdn.quilljs.com/1.3.6/quill.snow.css',
    '../../../assets/css/user-pro-style/shards-dashboards.1.1.0.min.css',
    '../../../assets/css/user-pro-style/extras.1.1.0.min.css',
    '../../../assets/css/user-pro-style/shards-dashboards.1.1.0.css',
    '../../../assets/css/user-pro-style/danger.1.1.0.css',
    '../../../assets/css/user-pro-style/danger.1.1.0.min.css',
    '../../../assets/css/user-pro-style/success.1.1.0.css',
    '../../../assets/css/user-pro-style/info.1.1.0.css',
    '../../../assets/css/user-pro-style/info.1.1.0.min.css',
    '../../../assets/css/user-pro-style/secondary.1.1.0.css',
    '../../../assets/css/user-pro-style/secondary.1.1.0.min.css',
    '../../../assets/css/user-pro-style/success.1.1.0.min.css',
    '../../../assets/css/user-pro-style/warning.1.1.0.css',
    '../../../assets/css/user-pro-style/warning.1.1.0.min.css',
    '../../../assets/css/user-pro-style/scss/_alert.scss',
    '../../../assets/css/user-pro-style/scss/_badge.scss',
    '../../../assets/css/user-pro-style/scss/_button-group.scss',
    '../../../assets/css/user-pro-style/scss/_buttons.scss',
    '../../../assets/css/user-pro-style/scss/_card.scss',
    '../../../assets/css/user-pro-style/scss/_custom-forms.scss',
    '../../../assets/css/user-pro-style/scss/_custom-sliders.scss',
    '../../../assets/css/user-pro-style/scss/_dropdown.scss',
    '../../../assets/css/user-pro-style/scss/_icons.scss',
    '../../../assets/css/user-pro-style/scss/_images.scss',
    '../../../assets/css/user-pro-style/scss/_input-group.scss',
    '../../../assets/css/user-pro-style/scss/_list-group.scss',
    '../../../assets/css/user-pro-style/scss/_navbar.scss',
    '../../../assets/css/user-pro-style/scss/_overrides.scss',
    '../../../assets/css/user-pro-style/scss/_reboot.scss',
    '../../../assets/css/user-pro-style/scss/_utilities.scss',
    '../../../assets/css/user-pro-style/scss/_variables.scss',
    '../../../assets/css/user-pro-style/scss/shards-dashboards.scss'
  ];
  ngOnInit(): void {
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });
    this.primengConfig.ripple = true;
    this.loadScripts();
    /*setTimeout(()=>{
      printLogger('from ts to js');
    },1000);*/
    this.user = this.authenticationService.getUserFromLocalCache();
    if (this.user.brandImageAsString != null || this.user.brandImageAsString != undefined) {
      this.user.brandImage = JSON.parse(this.user.brandImageAsString);
    }
    if (this.user.profileImageAsString != null || this.user.profileImageAsString != undefined) {
      this.user.profileImage = JSON.parse(this.user.profileImageAsString);
    }
    this.brandingColor = this.sanitizer.bypassSecurityTrustStyle(this.user.color);
    
    for (let i = 0; i < this.cssPath.length; i++) {
      this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
      this.renderer2.appendChild(this.document.head, this.styleUser[i]);
      this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
      this.renderer2.setProperty(this.styleUser[i], 'href', this.cssPath[i]);
    }
  }
  ngOnDestroy(): void {
    for (let i = 0; i < this.cssPath.length; i++) {
      this.renderer2.removeChild(this.document.head, this.styleUser[i]);
    }
    this.styleUser=[];
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }


  loadScripts() {
    const dynamicScripts = [
      'https://buttons.github.io/buttons.js',
      'https://cdn.quilljs.com/1.3.6/quill.js',
      'https://code.jquery.com/jquery-3.7.1.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.10.2/umd/popper.min.js',
      '../../../assets/js/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js',
      'https://unpkg.com/shards-ui@latest/dist/js/shards.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Sharrre/2.0.1/jquery.sharrre.min.js',
      '../../../assets/js/user-pro-dashboard/extras.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/shards-dashboards.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/shards-dashboards.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-overview.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-overview.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/app-components-overview.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/app/app-components-overview.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-new-post.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-new-post.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/user-pro.js',
      //'../../../assets/js/bootstrap.bundle.min.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  imageChangedEventBranding: any = null;
  imageChangedEventProfile: any = null;
  croppedImageBranding: any = null;
  croppedImageProfile: any = null;
  tempBranding: File = null;
  tempProfile: File = null;
  @ViewChild('editUserForm') updateUserForm: NgForm;
  fileChangeEvent(event: any, option: string): void {
    if (option === 'branding') {
      this.imageChangedEventBranding = event;
    } else {
      this.imageChangedEventProfile = event;
    }
  }
  imageCropped(event: ImageCroppedEvent, option: string) {
    var randomString = (Math.random() + 1).toString(36).substring(7);
    if (option === 'branding') {
      this.croppedImageBranding = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      //this.tempBranding = event.blob; 
      this.tempBranding = new File([event.blob], randomString + '.jpg');
      //console.log(this.tempBranding);
    } else {
      this.croppedImageProfile = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.tempProfile = new File([event.blob], randomString + '.jpg');
    }
    // event.blob can be used to upload the cropped image
  }
  // image events enables the form to update full user
  imageLoaded(image: LoadedImage, option: string) {
    if (option == 'branding') {
      this.updateUserForm.control.markAsDirty();
    } else if (option == 'profile') {
      this.updateUserForm.control.markAsDirty();
    }
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
    this.notificationService.notify(NotificationType.ERROR, `Algo salio mal. Por favor intentelo pasados unos minutos.`);
  }

  updateUser() {
    if (this.tempBranding != null) {
      const body = new FormData();
      //var randomString = (Math.random() + 1).toString(36).substring(10);
      body.append('image', this.tempBranding);
      this.subscriptions.push(this.userService.uploadSignature(body, this.tempBranding.name)
        .subscribe({
          next: (res: any) => {
            this.user.brandImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            console.log(res);
            this.user.brandImageAsString = JSON.stringify(this.user.brandImage);
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, `Imagen corporativa: algo salio mal. Por favor intentelo pasados unos minutos.` + err);
            this.brandImageRefreshing = false;
          }
        }));
    }
    // user profile file
    if (this.tempProfile != null) {
      const body = new FormData();
      body.append('image', this.tempProfile);
      this.subscriptions.push(this.userService.uploadSignature(body, this.tempProfile.name)
        .subscribe({
          next: (res: any) => {
            this.user.profileImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            //this.reportUploadProgress(res);
            console.log(res);
            this.user.profileImageAsString = JSON.stringify(this.user.profileImage);
            this.imageProfileRefreshing = false;
          },
          error: (err: any) => {
            this.imageProfileRefreshing = false;
            console.log(err);
          }
        }));
    }
    setTimeout(() => {
      this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.clear();
          //this.authenticationService.addUserToLocalCache(res);
          this.notificationService.notify(NotificationType.SUCCESS, `Se ha actualizado el perfil`);
          this.router.navigate(['/home'])
          setTimeout(() => {
            this.notificationService.notify(NotificationType.SUCCESS, `Vuelva a iniciar sesión`);
          }, 1000);
        },
        error: (err: any) => {
          console.log(err);
        }
      }));
    }, 1500);

  }

}
