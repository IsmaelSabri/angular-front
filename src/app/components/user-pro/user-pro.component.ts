import { BadgeDestacar, PropertyState, PropertyTo } from './../../class/property-type.enum';
import { ProfileImage } from './../../model/user';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
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
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HomeService } from 'src/app/service/home.service';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/service/image.service';
import _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Bathrooms, HouseType, TipoDeVia, Views } from 'src/app/class/property-type.enum';
import { nzSize } from 'src/app/class/ant-design.enum';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { initFlowbite } from 'flowbite';
import { BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { grayPointerIcon, homeicon } from 'src/app/model/maps/icons';
import { Jawg_Sunny, Stadia_OSMBright } from 'src/app/model/maps/functions';
import { HomeComponent } from 'src/app/home/home.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-pro',
  templateUrl: './user-pro.component.html',
  styleUrl: './user-pro.component.css'
})
export class UserProComponent extends HomeComponent implements OnInit, OnDestroy {

  protected styleUser: HTMLLinkElement[] = [];
  userUpdate: User = new User();
  homes: Home[] = [];
  home: Home = new Home();
  routerLinkId: number = 0;
  routerLinkModel: string;
  map2!: L.Map; // map geocoding search location


  chats: Chat[] = [];
  selectedUserId: string = "";
  selectedUser: User = new User();
  hub: signalR.HubConnection | undefined;
  message: string = "";

  vistas: string[] = Object.values(Views);
  @ViewChild('sidenav') sidenav: MatSidenav;
  resizeStyleListSidenav = { "max-width": `100vh !important`, };

  constructor(
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    protected modalServiceBs: BsModalService,
    @Inject(DOCUMENT) protected document: Document,
    protected sanitizer: DomSanitizer,
    primengConfig: PrimeNGConfig,
    messageService: MessageService,
    protected chatService: ChatService,
    protected homeService: HomeService,
    protected imageService: ImageService,
    protected nzMessage: NzMessageService,
    protected modalService: NgbModal,
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr,
      homeService,
      sanitizer,
      modalServiceBs,
      document,
      renderer2,
      primengConfig,
      messageService,
      nzMessage,
      modalService,
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

  formFieldControl() {
    if (this.home.tipo == 'Habitación') {
      this.saleTab.next(true);
      this.rentTab.next(false);
      this.home.precioFinal = null;
      this.home.condicion = 'Compartir';
    } else if (this.home.condicion == 'Venta') {
      this.rentTab.next(true);
      this.saleTab.next(false);
      this.home.precioAlquiler = null;
    } else if (this.home.condicion == 'Alquiler y venta') {
      this.rentTab.next(false);
      this.saleTab.next(false);
    } else if (this.home.condicion == 'Alquiler') {
      this.saleTab.next(true);
      this.home.precioFinal = null;
      this.rentTab.next(false);
    } else {
      this.saleTab.next(true);
      this.rentTab.next(false);
      this.home.precioFinal = null;
    }
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

  visibleSidenav: boolean = false;
  preSelectedViews: string[] = []
  yearAntiguedad: Date;
  openSidenav(home: Home) {
    this.subscriptions.push(this.homeService.getHomesByQuery('model@=*' + home.model + ',' + 'viviendaId@=*' + home.viviendaId + ',').subscribe({
      next: (res) => {
        if (res) {
          this.home = this.homeService.performHome(res[0]);
          this.visibleSidenav = true;
          this.preSelectedViews = this.home.vistasDespejadas.split(',');
          this.yearAntiguedad = new Date(this.home.antiguedad + '-1-1');
          if (this.home.energyCertAsString) {
            this.energyImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.home.energyCert.imageUrl);
          }
          if (this.imageChangedEventEnergyUpdate) {
            this.croppedImageEnergyUpdate = null;
            this.imageChangedEventEnergyUpdate = null;
            this.tempEnergyUpdate = null;
            this.tempEnergyTagNameUpdate = null;
          }
          setTimeout(() => {
            if (this.map3 == undefined) {
              this.map3 = L.map('map_3', {
                renderer: L.canvas(),
                invalidateSize: true,
              }).setView([this.home.lat, this.home.lng], 15);
              //Stadia_OSMBright().addTo(this.map3);
              Jawg_Sunny().addTo(this.map3);
              this.markerHouse = new L.marker([this.home.lat, this.home.lng], {
                draggable: false,
                icon: homeicon,
              });
              this.markerHouse.addTo(this.map3);
            }
          }, 1000);
        }
      },
      error: () => { }
    }))
  }

  closeDrawer() {
    this.visibleSidenav = false;
  }
  updateHome() {
    //console.log('updating')
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
    initFlowbite();
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
    this.getFavourites();
    this.setCardLike()
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

  userFavourites: Home[] = [];
  public getFavourites() {
    this.homeService.getHomesByQuery('LikeMeForeverAsString@=*' + this.user.userId).subscribe({
      next: (res: Home[]) => {
        if (res) {
          this.userFavourites = [...res]
          for (let i = 0; i < res.length; i++) {
            this.userFavourites[i] = this.homeService.performHome(this.userFavourites[i]);
          }
        }
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, 'Error al cargar los favoritos' + err);
      }
    });
  }

  // nzMessages
  createMessage(type: string, content: string): void {
    this.nzMessage.create(type, content, {});
  }

  cuoreLike(home: Home) {
    if (this.state) {
      var selectedHome = home;
      var userValue = this.user.userId;
      if (selectedHome.likeMeForever.includes(userValue)) {
        selectedHome.likeMeForever.forEach((item, index) => {
          if (item == userValue) selectedHome.likeMeForever.splice(index, 1);
        });
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: () => {
            this.notificationService.notify(NotificationType.DEFAULT, 'Borrado desde favoritos');
            //this.createMessage("success", "Borrado desde favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      } else {
        selectedHome.likeMeForever.push(userValue);
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: () => {
            this.notificationService.notify(NotificationType.DEFAULT, 'Guardado en favoritos');
            //this.createMessage("success", "Guardado en favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      }
    }
  }

  @ViewChildren('redheartcheckbox') likes4ever: QueryList<ElementRef>
  setCardLike() {
    setTimeout(() => {
      if (this.state) {
        this.likes4ever.forEach(f => {
          const doc = document.getElementById(f.nativeElement.id) as HTMLInputElement;
          doc.checked = true;
        });
      }
    }, 500);
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
          this.getFavourites();
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

  // update city form
  showCityResult() {
    if (this.home.ciudad == null) {
      alert('Introduzca la provincia!');
    } else {
      this.home.ciudad = this.home.ciudad.split(' ')[0].replace(',', '');
      this.closeDialog();
    }
  }

  locationMap() {
    this.showDialog();
    if (this.map2 == null || this.map2 == undefined) {
      const search = GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        popupFormat: ({ result }) => (this.home.ciudad = result.label),
        searchLabel: 'Ciudad',
        resultFormat: ({ result }) => result.label,
        marker: {
          icon: grayPointerIcon,
          draggable: false,
        },
      });
      setTimeout(() => {
        var x = document.getElementById('map_2');
        x.style.display = 'flex';
        this.map2 = L.map('map_2', { renderer: L.canvas() }).setView(
          [40.4380986, -3.8443428],
          5
        );
        //this.getLocation();
        Stadia_OSMBright().addTo(this.map2);
        //tileLayerHere().addTo(this.map2);
        this.map2.addControl(search);
      }, 300)
    }
  }

  checkBox(param): any {
    //console.log(param)
    //setTimeout(() => { console.log(this.home.aireAcondicionado) }, 1000);

  }

  ngOnDestroy(): void {
    for (let i = 0; i < cssPathUserPro.length; i++) {
      this.renderer2.removeChild(this.document.head, this.styleUser[i]);
    }
    this.styleUser = [];
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
