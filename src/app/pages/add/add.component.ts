import { HomeService } from 'src/app/service/home.service';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject, Inject, Renderer2, Input, AfterViewInit } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { NotificationService } from '../../service/notification.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Aeropuerto, Beach, Bus, Home, Metro, Supermercado, Universidad, HomeImage, Colegio, SingleDtoHomeRequest } from '../../model/home';
import { ToastrService } from 'ngx-toastr';
import { ContactUser } from 'src/app/model/contact-user';
import { Lightbox } from 'ngx-lightbox';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import {
  tileLayerSelect, tileLayerCP, tileLayerWMSSelect, tileLayerHere, tileLayerWMSSelectIGN, tileLayerTransportes,
  Stadia_OSMBright, OpenStreetMap_Mapnik, CartoDB_Voyager, Thunderforest_OpenCycleMap, Jawg_Sunny
} from '../../model/maps/functions';
import {
  homeicon, beachIcon, airportIcon, marketIcon, subwayIcon,
  busIcon, schoolIcon, universityIcon, fancyGreen,
} from '../../model/maps/icons';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import { Modal } from 'bootstrap';
import { APIKEY } from 'src/environments/environment.prod';
import intlTelInput from 'intl-tel-input';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { DOCUMENT } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from 'src/app/components/private-chat/private-chat.component';
import { ChatService } from 'src/app/service/chat.service';
import { Message } from 'src/app/model/message';
import { GestureHandling } from "leaflet-gesture-handling";
import * as $ from 'jquery';
import { HomeComponent } from 'src/app/home/home.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})

export class AddComponent extends HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  protected sanitizer = inject(DomSanitizer);
  homes: Home[] = [];
  aux: string;
  public refreshing: boolean;
  contactUser: ContactUser = new ContactUser();
  private host = environment.apiUrl;
  json: string;
  _albums: any = [];
  isCollapsed: boolean = true;
  trustedUrl: any = '';
  //home: Home;
  //propertyOwner: User;
  intake: string;
  emissions: string;
  @Input() messages: Message[] = this.chatService.privateMessages;
  //maps
  mapAdd!: L.map;
  circle!: L.circle;
  indexGoal: number; // array index
  nextCoords!: L.LatLng; // temp coordinates to put any service
  fg = L.featureGroup();
  time: number;
  distance: string;
  // add-delete temp routes
  mapEvents = new Set<string>();
  // icons
  bch = beachIcon;
  airp = airportIcon;
  mki = marketIcon;
  swi = subwayIcon;
  busic = busIcon;
  sc = schoolIcon;
  uni = universityIcon;
  customIcon: any;
  responsiveOptions = [ // carousel slick
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  responsiveOptions2: any[] = [ // carousel implicit
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  //routes
  colegio: Colegio[];
  universidad: Universidad[];
  autobus: Bus[];
  metro: Metro[];
  mercados: Supermercado[];
  aeropuerto: Aeropuerto[];
  beach: Beach[];

  constructor(
    @Inject(DOCUMENT) document: Document,
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    homeService: HomeService,
    private _lightbox: Lightbox,
    private _changeDetectorRef: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    primengConfig: PrimeNGConfig,
    public chatService: ChatService,
    private modalSevice: NgbModal,
    sanitizer: DomSanitizer,
    modalServiceBs: BsModalService,
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

    );
  }

  @ViewChild('phone') inputElement;
  ngAfterViewInit(): void {
    // tel flags
    if (this.inputElement) {
      intlTelInput(this.inputElement.nativeElement, {
        initialCountry: 'es',
        //utilsScript:'../../../../node_modules/intl-tel-input/build/js/utils.js'
      })
    }
  }

  getTrustedUrl() {
    if (this.home.video != null || this.home.video != undefined) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.home.video);
    }
  }

  ngOnInit(): void {
    var x = document.getElementById('photos-section');
    x.style.display = 'none'
    // mas rápido desde localstorage después lo machaco desde la api para coger el modelo
    // que ese sí tiene todos los atributos
    if (this.homeService.getHomeFromLocalCache()) {
      this.home = this.homeService.getHomeFromLocalCache();
    }
    if (this.home.proColor != null || this.home.proColor != undefined) {
      this.brandingColor = this.sanitizer.bypassSecurityTrustStyle(this.home.proColor);
    }
    if (this.home.proImage != null || this.home.proImage != undefined) {
      this.brandingImage = this.sanitizer.bypassSecurityTrustStyle(this.home.proImage);
    }
    /*this.subscriptions.push(this.userService.getUserByUserId(this.home.idCreador).subscribe({
      next: (res) => {
        this.propertyOwner=res;
          
      }, error: () => {
        this.notificationService.notify(
          NotificationType.ERROR, 'Propietario del anuncio' + this.dto.id + ' desconocido',
        );
      }
    }));*/
    //get the current home through url
    this.subscriptions.push(
      this.activatedRoute.fragment.subscribe({
        next: (model) => {
          this.dto.model = model;
          this.activatedRoute.params.subscribe({
            next: (params) => {
              this.dto.id = params['id'];
            }, error: (errorResponse: HttpErrorResponse) => {
              this.notificationService.notify(
                NotificationType.ERROR,
                errorResponse.error.message + 'Cannot catch home id'
              );
            }
          })
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            errorResponse.error.message + 'Cannot catch home model'
          );
        }
      }));
    const homeDto = JSON.stringify(this.dto);
    this.subscriptions.push(this.homeService.gethome(this.dto.id, homeDto).subscribe({
      next: (res) => {
        this.home = res;
        if (this.state) {
          this.user = this.authenticationService.getUserFromLocalCache();
        }
        setTimeout(() => {
          for (let i = 0; i < this.home.images.length; i++) {
            const src = this.home.images[i].imageUrl + i + '.jpg';
            const caption = i + 1 + ' / ' + this.home.images.length;
            const thumb = this.home.images[i].imageUrl + i + '.jpg';
            const album = {
              src: src,
              caption: caption,
              thumb: thumb,
            };
            this._albums.push(album);
          }
        }, 1000);
        this.home.images = JSON.parse(this.home.imagesAsString);
        var y = document.getElementById('skeleton-section');
        y.style.display = 'none';
        x.style.display = 'block';
        this.setEnergyFeatures(
          this.home.consumo.substring(0, 1),
          this.home.emisiones.substring(0, 1)
        );
        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        this.mapAdd = L.map('mapAdd', { renderer: L.canvas(), gestureHandling: true }).setView(
          [this.home.lat, this.home.lng],
          17
        );
        Stadia_OSMBright().addTo(this.mapAdd);
        this.circle = new L.circle([this.home.lat, this.home.lng], { radius: 75, color: '#3a3b3c' }).addTo(this.mapAdd);
        this.colegio = JSON.parse(this.home.colegios);
        this.universidad = JSON.parse(this.home.universidades);
        this.mercados = JSON.parse(this.home.supermercados);
        this.autobus = JSON.parse(this.home.bus);
        this.aeropuerto = JSON.parse(this.home.aeropuerto);
        this.beach = JSON.parse(this.home.distanciaAlMar);
        this.metro = JSON.parse(this.home.metro);
        // to clear circle when print any route
        this.mapEvents.add('circle');
        this.loadScripts();

        this.homeService.getHomes().subscribe((data) => {
          this.homes = data;
          for (let i = 0; i < this.homes.length; i++) {
            this.homes[i].images = JSON.parse(this.homes[i].imagesAsString);
          }
        })
      },
      error: () => {
        this.notificationService.notify(
          NotificationType.ERROR, 'El anuncio' + this.dto.id + ' ha caducado o ha sido eliminado',
        );
        this.router.navigateByUrl('/home');
      }
    }));
    //if(Object.keys(this.home).length){
  }

  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }

  submitHouseDetails() { }

  discount(priceA: string, priceB: string): number {
    var x: number = +priceA.replace(/\,/g, '');
    var y: number = +priceB.replace(/\,/g, '');
    return Math.round(((((x - y) * 100) / x) * 100) / 100);
  }

  calcPriceM2(price: string, sup: string): number {
    var x: number = +price.replace(/\,/g, '');
    var y: number = +sup;
    return Math.round(((x / y) * 100) / 100);
  }

  setEnergyFeatures(featureC: string, featureE: string) {
    switch (featureC) {
      case 'A':
        this.intake = '../../../assets/svg/eco/eco A.svg';
        break;
      case 'B':
        this.intake = '../../../assets/svg/eco/eco B.svg';
        break;
      case 'C':
        this.intake = '../../../assets/svg/eco/eco C.svg';
        break;
      case 'D':
        this.intake = '../../../assets/svg/eco/eco D.svg';
        break;
      case 'E':
        this.intake = '../../../assets/svg/eco/eco E.svg';
        break;
      case 'F':
        this.intake = '../../../assets/svg/eco/eco F.svg';
        break;
      case 'G':
        this.intake = '../../../assets/svg/eco/eco G.svg';
        break;

      default:
        break;
    }
    switch (featureE) {
      case 'A':
        this.emissions = '../../../assets/svg/eco/eco A.svg';
        break;
      case 'B':
        this.emissions = '../../../assets/svg/eco/eco B.svg';
        break;
      case 'C':
        this.emissions = '../../../assets/svg/eco/eco C.svg';
        break;
      case 'D':
        this.emissions = '../../../assets/svg/eco/eco D.svg';
        break;
      case 'E':
        this.emissions = '../../../assets/svg/eco/eco E.svg';
        break;
      case 'F':
        this.emissions = '../../../assets/svg/eco/eco F.svg';
        break;
      case 'G':
        this.emissions = '../../../assets/svg/eco/eco G.svg';
        break;

      default:
        break;
    }
  }

  loadScripts() {
    const dynamicScripts = [
      '../../../assets/js/ad.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  cuoreLike() {
    if (this.authenticationService.isUserLoggedIn()) {
      // el usuario guarda en favoritos la propiedad
      // notificationService bla bla bla
      console.log('guardado!!');
    } else {
      const element = document.getElementById('exampleModal') as HTMLElement;
      const myModal = new Modal(element);
      myModal.show();
      //this.clickButton('#cuore');
    }
  }

  setAdRoute(
    latitud: string,
    longitud: string,
    color: string,
    customIcon: any,
    index: number,
  ) {
    var lat = +latitud;
    var lng = +longitud;
    this.indexGoal = index;
    this.customIcon = customIcon;
    if (this.mapEvents.has('circle')) {
      this.mapAdd.eachLayer(function (layer) {
        layer.remove();
      });
      Jawg_Sunny().addTo(this.mapAdd);
      this.mapEvents.delete('circle');
    }
    if (this.mapEvents.has('control')) {
      this.mapAdd.eachLayer(function (layer) {
        layer.remove();
      });
      Jawg_Sunny().addTo(this.mapAdd);
      this.mapEvents.delete('control');
    }
    var control = L.Routing.control({
      router: new L.Routing.Here(APIKEY.hereToken, {
        alternatives: [1],
        routeRestriction: {
          transportMode: 'pedestrian',
          routingMode: 'short',
        },
        urlParameters: {
          avoid: {
            tollTransponders: 'all',
          },
        },
      }),
      waypoints: [
        L.latLng(this.home.lat, this.home.lng),
        L.latLng(lat, lng),
      ],
      createMarker: function (i, wp, nWps) {
        if (i === 0) {
          // start
          return L.marker(wp.latLng, {
            icon: homeicon,
            draggable: false,
            bounceOnAdd: true,
            name: 'start',
          });
        } else if (i == nWps - 1) {
          // finish
          return L.marker(wp.latLng, {
            icon: customIcon,
            draggable: true,
            bounceOnAdd: true,
          })/*.bindTooltip(
            `
            <div id="container">
              <div id="content">
              <div class="details-text">Distancia: <b> ${this.distance} Km</b></div>
              <div class="details-text">Tiempo: <b> ${this.time} Min</b></div>
            </div>
            `
          );*/
        }
      },
      routeWhileDragging: true,
      language: 'es',
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: color, weight: 4 }],
      },
    });
    this.mapAdd.addControl(control);
    control.on('routesfound', (e) => {
      var routes = e.routes;
      var summary = routes[0].summary;
      this.distance = (summary.totalDistance / 1000).toFixed(2);
      this.time = Math.round((summary.totalTime % 3600) / 60);
      /*console.log(this.distance + ' ' + this.time);
      console.log(
        (summary.totalDistance / 1000).toFixed(2) +
        ' km. ' +
        Math.round((summary.totalTime % 3600) / 60) +
        ' minutos'
      );*/
      var waypoints = e.waypoints || [];
      var destination = waypoints[waypoints.length - 1];
      this.nextCoords = destination.latLng;
      this.mapAdd.fitBounds(L.latLngBounds([this.home.lat, this.home.lng], this.nextCoords));
    });
    this.mapEvents.add('control');
    control._container.style.display = "None";
  }

  checkBox(param): any {
    console.log(param);
  }

  public contactMessage() {
    this.refreshing = true;
    const formData = new FormData();
    formData.append('nombre', this.contactUser.name);
    formData.append('correo', this.contactUser.mail);
    formData.append('telefono', this.contactUser.phone);
    formData.append('mensaje', this.contactUser.msg);
    Swal.fire({
      title: "Enviado!",
      text: "La respuesta la recibirás en tu correo electrónico!",
      icon: "success"
    });
    var resetForm = <HTMLFormElement>document.getElementById('contactMessageForm');
    resetForm.reset();
    /*this.subscriptions
      .push
      
     hay que implementar el envio del correo:
     - en el servicio 
     - en el backend(plantilla html)
     
     this.markerService.addBuilding(formData).subscribe((res) => {
        this.router.navigate(['/home']),
          this.notificationService.notify(NotificationType.SUCCESS, ` Mensaje enviado.`);
        var resetForm = <HTMLFormElement>document.getElementById('contactForm');
        resetForm.reset();
        this.clickButton('contact-form-close');
      })
      ()*/;
  }

  openPrivateChat(toUser: string) {
    this.chatService.createChatConnection();
    const modalRef = this.modalSevice.open(PrivateChatComponent);
    modalRef.componentInstance.toUser = toUser;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.chatService.stopChatConnection();
  }
}
