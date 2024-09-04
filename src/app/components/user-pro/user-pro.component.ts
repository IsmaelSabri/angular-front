import { HomeDto } from './../../model/dto/home-dto';
import { ProfileImage } from './../../model/user';
import { Component, Inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
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
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/model/user';
import { Home } from 'src/app/model/home';
import { Chat } from 'src/app/model/chat';
import * as signalR from '@microsoft/signalr';
import { cssPathUserPro } from 'src/app/model/performance/css-styles';
import { dynamicUserProScripts } from 'src/app/model/performance/js-scripts';
import { ChatService } from 'src/app/service/chat.service';
import { format, compareAsc, formatDistance, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HomeService } from 'src/app/service/home.service';
import { GalleriaThumbnails } from 'primeng/galleria';
import { CustomHttpResponse } from 'src/app/model/performance/custom-http-response';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/service/image.service';
import _ from 'lodash';
@Component({
  selector: 'app-user-pro',
  templateUrl: './user-pro.component.html',
  styleUrl: './user-pro.component.css'
})
export class UserProComponent extends UserComponent implements OnInit, OnDestroy {

  protected styleUser: HTMLLinkElement[] = [];
  userUpdate: User = new User();
  homes: Home[] = [];
  routerLinkId: number = 0;
  routerLinkModel: string;

  chats: Chat[] = [];
  selectedUserId: string = "";
  selectedUser: User = new User();
  hub: signalR.HubConnection | undefined;
  message: string = "";

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
    primengConfig: PrimeNGConfig,
    messageService: MessageService,
    protected chatService: ChatService,
    protected homeService: HomeService,
    protected imageService: ImageService
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
      imageService
    );
    this.hub = new signalR.HubConnectionBuilder().withUrl("https://localhost:4040/chat-hub").build();

    this.hub.start().then(() => {
      console.log("Connection is started...");

      this.hub?.invoke("Connect", this.user.id);

      this.hub?.on("Users", (res: User) => {
        console.log(res);
        this.users.find(p => p.id == res.id)!.status = res.status;
      });

      this.hub?.on("Messages", (res: Chat) => {
        console.log(res);

        if (this.selectedUserId == res.userId) {
          this.chats.push(res);
        }
      })
    })
  }

  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  protected ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  changeUser(user: User) {
    this.selectedUserId = user.id;
    this.selectedUser = user;
    this.subscriptions.push(this.chatService.getChats(this.user.id, this.selectedUserId).subscribe({
      next: (res: any) => {
        this.chats = res;
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, `No se ha podido cargar el chat. Intentelo pasados unos minutos.` + err);
      }
    }));
  }

  sendMessage() {
    const data = {
      "userId": this.user.id,
      "toUserId": this.selectedUserId,
      "message": this.message
    }
    this.subscriptions.push(this.chatService.sendMessage(data).subscribe({
      next: (res: any) => {
        this.chats.push(res);
        this.message = '';
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, `No se ha podido enviar el mensaje. Intentelo pasados unos minutos.` + err);
      }
    }));
  }

  getAvatar(file: string): ProfileImage {
    return JSON.parse(file);
  }

  visibleDrawer: boolean = false;
  openDrawer() {
    this.visibleDrawer = true;
  }
  closeDrawer() {
    this.visibleDrawer = false;
  }
  updateHome() {
    console.log('updating')
  }

  deleteHome(home: Home) {
    Swal.fire({
      title: "Seguro?",
      text: "Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8093f1",
      cancelButtonColor: "#ee7272",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, Borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        var homeId = home.viviendaId;
        this.subscriptions.push(this.homeService.deleteHome(home.id).subscribe({
          next: (res: any) => {
            this.notificationService.notify(NotificationType.INFO, 'Anuncio borrado')
            localStorage.removeItem('currentBuilding');
            this.user.domains.forEach((item, index) => {
              if (item.viviendaId == homeId) this.user.domains.splice(index, 1);
            })
          },
          error: (error: any) => {
            this.notificationService.notify(NotificationType.ERROR, error.message);
          }
        }))
      }
    });
  }

  highlightHome() {

  }

  showHome(home: Home) {
    if (home) {
      this.homeService.addHomeToLocalCache(home);
      this.routerLinkId = +home.id;
      this.routerLinkModel = home.model;
      /*setTimeout(() => {
        $('#linkPopup').trigger('click');
      }, 100);*/

      setTimeout(() => {
        this.clickButton('linkPopup');
      }, 100);

    }
  }

  date: Date;
  formatChatDate(timestamp: string): any {
    var newDate = new Date(timestamp);
    var options = {
      locale: es,
      addSuffix: true
    };
    if (this.date == null || this.date == undefined) {
      this.date = new Date(timestamp);
      return formatDistance(this.date, Date.now(), options);
    } else if (this.date.toLocaleString().split('')[0] != newDate.toLocaleString().split('')[0]) {
      this.date = newDate;
      return formatDistance(newDate, Date.now(), options);
    } else {
      return
    }
  }

  formatChatHourPopup(timestamp: string): string {
    var hora = timestamp.substring(11, 16);
    return hora;
  }

  ngOnInit(): void {
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });
    // apaño temporal para probar el chat. Luego se añaden onclick en el anuncio
    // y se borran desde la interfaz
    this.subscriptions.push(this.userService.getUsers().subscribe({
      next: (res: User[]) => {
        res = res.filter(user => user.userId != this.user.userId)
        this.user.chatsOpened = [...res];
        //console.log(this.user.chatsOpened[0].profileImage.imageUrl);
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, `No se ha podido enviar el mensaje. Intentelo pasados unos minutos.` + err);
      }
    }));
    this.primengConfig.ripple = true;
    this.loadScripts();
    this.user = this.authenticationService.getUserFromLocalCache();
    this.brandingColor = this.sanitizer.bypassSecurityTrustStyle(this.user.color);

    for (let i = 0; i < cssPathUserPro.length; i++) {
      this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
      this.renderer2.appendChild(this.document.head, this.styleUser[i]);
      this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
      this.renderer2.setProperty(this.styleUser[i], 'href', cssPathUserPro[i]);
    }
    this.getOwnHomes()

  }

  public getOwnHomes() {
    this.homeService.getHomesByQuery('IdCreador@=*' + this.user.userId).subscribe({
      next: (res: Home[]) => {
        if (res) {
          this.user.domains = [...res]
          for (let i = 0; i < res.length; i++) {
            this.user.domains[i] = this.homeService.performHome(this.user.domains[i]);
          }
        }
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, 'Error al cargar las viviendas' + err);
      }
    });
  }

  loadScripts() {
    for (let i = 0; i < dynamicUserProScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicUserProScripts[i];
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
    this.showLoading = true;
    if (this.tempBranding != null) {
      const body = new FormData();
      //var randomString = (Math.random() + 1).toString(36).substring(10);
      body.append('image', this.tempBranding);
      this.subscriptions.push(this.imageService.uploadSignature(body, this.tempBranding.name)
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
      this.subscriptions.push(this.imageService.uploadSignature(body, this.tempProfile.name,)
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
    this.user.username = this.user.firstname + ' ' + this.user.lastname
    setTimeout(() => {
      this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
        next: (res: User) => {
          this.user = this.userService.performUser(res);
          this.authenticationService.addUserToLocalCache(res);
          console.log(this.user);
          this.getOwnHomes();
          setTimeout(() => { this.tunedHomesAfterUpdateUser(); }, 1000)
          this.notificationService.notify(NotificationType.SUCCESS, `Se ha actualizado el perfil`);
        },
        error: (err: any) => {
          console.log(err);
        }
      }));
    }, 1000);
    this.showLoading = false;
  }

  tunedHomesAfterUpdateUser() {
    if (this.user.brandImageAsString && this.user.color && this.user.isPro) {
      _.map(this.user.domains, (x) => {
        x.proColor = this.user.color;
        x.proImageAsString = this.user.brandImageAsString;
        this.subscriptions.push(this.homeService.updateHome(x).subscribe({
          next: (res) => {
            this.notificationService.notify(NotificationType.SUCCESS, `vivienda tuneada con id: ` + res.viviendaId);
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, `error al tunear la vivienda` + err);
          }
        }));
      })
    }
  }


  ngOnDestroy(): void {
    for (let i = 0; i < cssPathUserPro.length; i++) {
      this.renderer2.removeChild(this.document.head, this.styleUser[i]);
    }
    this.styleUser = [];
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
