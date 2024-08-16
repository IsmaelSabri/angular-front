import { HomeService } from 'src/app/service/home.service';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject, Inject, Renderer2, Input, AfterViewInit, ViewContainerRef, SimpleChanges, TemplateRef } from '@angular/core';
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
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/service/chat.service';
import { GestureHandling } from "leaflet-gesture-handling";
import * as $ from 'jquery';
import { HomeComponent } from 'src/app/home/home.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/model/user';
import { CustomHttpResponse } from 'src/app/model/performance/custom-http-response';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartType } from 'chart.js';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

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
  json: string;
  _albums: any = [];
  isCollapsed: boolean = true;
  privatePolicy: boolean = false;
  trustedUrl: any = '';
  views:string[]=[];
  //home: Home;
  //propertyOwner: User;
  intake: string;
  emissions: string;
  propertyOwner: User;
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
    messageService: MessageService,
    public chatService: ChatService,
    sanitizer: DomSanitizer,
    modalServiceBs: BsModalService,
    nzMessage: NzMessageService,
    modalSevice: NgbModal,
    private vcr: ViewContainerRef,

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
      modalSevice
    );
  }

  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  protected ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

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

  getTrustedProfileImage() {
    if (this.user?.profileImage.imageUrl != null || this.user?.profileImage.imageUrl != undefined) {
      return this.sanitizer.bypassSecurityTrustUrl(this.user?.profileImage.imageUrl);
    }
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    var x = document.getElementById('photos-section');
    x.style.display = 'none'
    // 1-localstorage 2-model
    if (this.homeService.getHomeFromLocalCache()) {
      this.home = this.homeService.getHomeFromLocalCache();
    }
    if (this.home.proColor) {
      this.brandingColor = this.sanitizer.bypassSecurityTrustStyle(this.home.proColor);
    }
    if (this.home.proImage) {
      this.brandingImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.home.proImage);
    }
    if (this.home.colorDestacar) {
      this.imageBadgeColor = this.sanitizer.bypassSecurityTrustStyle(this.home.colorDestacar);
    }
    // get the owner
    this.subscriptions.push(this.userService.getUserByUserId(this.home.idCreador).subscribe({
      next: (res) => {
        this.propertyOwner = res;
      }, error: () => {
        this.notificationService.notify(
          NotificationType.ERROR, 'El anuncio ' + this.dto.id + 'ha caducado o ha sido eliminado!',
        );
        this.router.navigateByUrl('/home');
      }
    }));
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
        this.home = this.homeService.performHome(res);
        if (this.home.energyCert) {
          this.energyImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.home.energyCert.imageUrl);
        }
        if (this.home.vistasDespejadas) {
          this.views=this.home.vistasDespejadas.split(',');
        }
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
          NotificationType.ERROR, 'El anuncio ' + this.dto.id + ' ha caducado o ha sido eliminado',
        );
        this.router.navigateByUrl('/home');
      }
    }));
    // marcar el like
    if (this.state) {
      setTimeout(() => {
        if (this.user.likePreferences.includes(this.home.viviendaId)) {
          const element = document.getElementById(this.home.viviendaId) as HTMLInputElement;
          element.checked = true;
        }
        //this.setCardLike();
      }, 1000);
    }
    //if(Object.keys(this.home).length){
    this.doughnutChartData = {
      labels: ['Precio de venta', 'Impuestos y gastos', 'Entrada', 'Financiado'],
      datasets: [
        {
          data: [this.home.precioFinal, +this.otherCosts(0).toFixed(0), 0, this.importeFinanciado],
          backgroundColor: this.getRandomColors(4),
          borderColor: this.getRandomColors(4),
        },
      ],
    };
  }

  cuoreLike(id: string) {
    if (this.state) {
      if (this.user.likePreferences.includes(id)) {
        this.user.likePreferences.forEach((item, index) => {
          if (item == id) this.user.likePreferences.splice(index, 1);
        });
        this.user.likePreferencesAsString = this.user.likePreferences.toString();
        this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
          next: (res: User) => {
            this.user = this.userService.performUser(res);
            this.authenticationService.addUserToLocalCache(this.user);
            this.homeService.addHomeToLocalCache(this.home);
            this.createMessage("success", "Borrado desde favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      } else {
        this.user.likePreferences.push(id);
        this.user.likePreferencesAsString = this.user.likePreferences.toString();
        this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
          next: (res: User) => {
            this.user = this.userService.performUser(res);
            this.authenticationService.addUserToLocalCache(this.user);
            this.homeService.addHomeToLocalCache(this.home);
            this.createMessage("success", "Guardado en favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      }
    } else {
      this.showModal('joinUsModalAd');
      const element = document.getElementById(id) as HTMLInputElement;
      element.checked = false;
    }
  }

  open(index: number): void {
    this._lightbox.open(this._albums, index, { wrapAround: true });
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
      'https://cdn.jsdelivr.net/npm/chart.js'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
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

  public contactMessage() {
    this.refreshing = true;
    this.showLoading=true;
    const formData = new FormData();
    formData.append('fromName', this.contactUser.fromName);
    formData.append('fromAddress', this.contactUser.fromAddress);
    formData.append('phone', this.contactUser.phone);
    formData.append('message', this.contactUser.message);
    formData.append('subject', this.contactUser.fromName + ' acerca de ' + this.home.tipo + ' ' + this.home.viviendaId);
    formData.append('toEmail', this.propertyOwner.email);
    formData.append('name', this.propertyOwner.firstname);
    formData.append('ccEmail', this.home.tipo + ' ' + this.home.viviendaId);
    /*
    * En el correo de contacto la imagen se puede mandar por aquí y
    * según el mes que mande una diferente.
    * 
    * if (this.home.images[0].imageUrl != null) 
    * formData.append('bccEmail', this.home.images[0].imageUrl);
    */
    var obj = {};
    formData.forEach((value, key) => obj[key] = value);
    var json = JSON.stringify(obj);
    this.subscriptions.push(this.userService.EmailMessage(json).subscribe({
      next: (res: CustomHttpResponse) => {
        Swal.fire({
          title: res.message,
          text: "La respuesta la recibirás en tu correo electrónico!",
          imageUrl: "https://unsplash.it/400/200",
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Custom image"
        });
      },
      error: (err: any) => {

      }
    }));
    var resetForm = <HTMLFormElement>document.getElementById('contactMessageForm');
    resetForm.reset();
    this.showLoading=false;
  }

  // sliders
  interes: number = .1;
  anyos: number = 1;
  entrada: number = 0;
  iva: number = .07;
  importeFinanciado: number = 0;
  importeAFinanciar: number = 0
  pagoMensual: number = 0;
  costeTotal: number = 0;
  registro: number = 0;
  notaria: number = 800;
  gestoria: number = 300;
  public doughnutChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  // chart Doughnut
  @ViewChild(BaseChartDirective) private chart?: BaseChartDirective;
  public doughnutChartType: ChartType = 'doughnut';
  calculeMortgage() {
    var tipo = (this.interes / 100 / 12);
    this.importeAFinanciar = (this.home.precioFinal - this.entrada);
    var mesesPagando = (this.anyos * 12);
    var pv = this.importeAFinanciar * tipo;
    this.pagoMensual = (pv * (Math.pow(1 + tipo, mesesPagando))) / ((Math.pow(1 + tipo, mesesPagando) - 1));
    this.importeFinanciado = (this.pagoMensual * mesesPagando);
    this.doughnutChartData = {
      labels: ['Capital financiado', 'Impuestos y gastos', 'Entrada'],
      datasets: [
        {
          data: [+this.importeFinanciado.toFixed(0), +this.otherCosts(0).toFixed(0), this.entrada],
          backgroundColor: this.getRandomColors(4),
          borderColor: this.getRandomColors(4),
        },
      ],
    };
    this.chart.update()
  }

  otherCosts(n: number) {
    return n + this.calcIva(this.iva) + this.calcRegistroPropiedad() + this.notaria + this.gestoria;
  }

  getRandomColors(num: number): string[] {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      );
    }
    return colors;
  }

  calcIva(value: number): number {
    return +(this.home.precioFinal * value).toFixed(0);
  }

  calcRegistroPropiedad(): number {
    //registro de propiedad
    var amount: number = 24.04;
    var maxCost: number = 2181;
    if (this.home.precioFinal <= 6010) {
      return amount;
    } else if (this.home.precioFinal > 6010) {
      for (var index = 6010; index < 30050; index += 1000) {
        amount += 1.75;
      }
    }
    if (this.home.precioFinal > 30050) {
      for (var index = 30050; index < 60101; index += 1000) {
        amount += 1.25;
      }
    }
    if (this.home.precioFinal > 60101) {
      for (var index = 60101; index < 150253; index += 1000) {
        amount += 0.75;
      }
    }
    if (this.home.precioFinal > 150253) {
      for (var index = 150253; index < 601012; index += 1000) {
        amount += 0.30;
      }
    }
    if (this.home.precioFinal > 601012) {
      for (var index = 30050; index < this.home.precioFinal; index += 1000) {
        amount += 0.20;
      }
    }
    if (amount > maxCost) {
      return maxCost;
    } else {
      return amount;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
