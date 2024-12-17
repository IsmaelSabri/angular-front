import { HomeService } from 'src/app/service/home.service';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject, Inject, Renderer2, Input, AfterViewInit, ViewContainerRef, SimpleChanges, TemplateRef, IterableDiffers } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { NotificationService } from '../../service/notification.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Aeropuerto, Beach, Bus, Home, Metro, Supermercado, Universidad, HomeImage, Colegio, Visitas } from '../../model/home';
import { ToastrService } from 'ngx-toastr';
import { ContactUser } from 'src/app/model/contact-user';
import { Lightbox } from 'ngx-lightbox';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
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
import { ImageService } from 'src/app/service/image.service';
import { EmailService } from 'src/app/service/email.service';
import { initFlowbite } from 'flowbite';
import { nzStatus } from 'src/app/class/ant-design.enum';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import _ from 'lodash';
import { addDays, isAfter, isBefore, parseISO, format, endOfDay } from 'date-fns';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  standalone: false
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
  views: string[] = [];
  projectFeatures: string[] = [];
  //home: Home;
  //propertyOwner: User;
  intake: string;
  emissions: string;
  propertyOwner: User;
  //maps
  mapAdd!: L.map;
  circle!: L.circle;
  indexGoal: number; // array index
  time: number;
  distance: string;
  // add-delete temp routes
  mapEvents = new Set<string>();

  // timeline
  inicioVentas: string;
  inicioConstruccion: string;
  mudandose: string;

  //routes
  colegio: Colegio[];
  universidad: Universidad[];
  autobus: Bus[];
  metro: Metro[];
  mercados: Supermercado[];
  aeropuerto: Aeropuerto[];
  beach: Beach[];
  PropertyTo: any;

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
    protected _lightbox: Lightbox,
    primengConfig: PrimeNGConfig,
    messageService: MessageService,
    protected chatService: ChatService,
    sanitizer: DomSanitizer,
    modalServiceBs: BsModalService,
    nzMessage: NzMessageService,
    modalService: NgbModal,
    imageService: ImageService,
    protected notification: NzNotificationService,
    protected emailService: EmailService,
    protected breakpointObserver: BreakpointObserver
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
      imageService,
      notification,
      breakpointObserver
    );
  }


  // navbar
  menuValue: boolean = false;
  openMenu() {
    this.menuValue = !this.menuValue;
  }
  closeMenu() {
    this.menuValue = false;
  }

  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  protected ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  @ViewChild('phone', { static: false }) inputElement: ElementRef<HTMLInputElement> = {} as ElementRef;;
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
    initFlowbite();
    this.primengConfig.ripple = true;
    //$('html').css('overflow', 'hidden');
    // 1-localstorage 2-model
    if (this.homeService.getHomeFromLocalCache()) {
      this.home = this.homeService.getHomeFromLocalCache();
      this.getHomeFromUrl();
    } else if (!this.homeService.getHomeFromLocalCache()) {
      this.getHomeFromUrl();
    } else {
      this.router.navigateByUrl('/home');
      NotificationType.ERROR, 'El anuncio ' + 'ha caducado o ha sido eliminado!';
      console.log('1')
    }
    if (this.home.colorDestacar) {
      this.imageBadgeColor = this.sanitizer.bypassSecurityTrustStyle(this.home.colorDestacar);
    }
    // get the owner
    this.subscriptions.push(this.userService.getUserByUserId(this.home.idCreador).subscribe({
      next: (res) => {
        this.propertyOwner = this.userService.performUser(res);
        if (this.propertyOwner.isPro) {
          if (this.propertyOwner.color) {
            this.brandingColor = this.sanitizer.bypassSecurityTrustStyle(this.propertyOwner.color);
          }
          if (this.propertyOwner.brandImage) {
            this.brandingImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.propertyOwner.brandImage.imageUrl);
          }
        }
      }, error: () => {
        this.notificationService.notify(
          NotificationType.ERROR, 'El anuncio ' + this.dto.id + 'ha caducado o ha sido eliminado!',
        );
        console.log('2')
        this.router.navigateByUrl('/home');
      }
    }));
    // do u like?
    if (this.state) {
      setTimeout(() => {
        if (this.home.likeMeForever.includes(this.user.userId)) {
          const element = document.getElementById(this.home.viviendaId) as HTMLInputElement;
          element.checked = true;
        }
        //this.setCardLike();
      }, 1000);
    }
    //if(Object.keys(this.home).length){
    // draw donut
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
    // guarda la visita
    setTimeout(() => {
      var today = format(new Date(), "yyyy-MM-dd")
      if (this.home.visitasAsString) { // no es la primera visita del anuncio
        _.map(this.home.visitas, v => {
          if (v.date == today) { // no es la primera visita del día 
            v.count++;
            if (this.state) { // usuario logueado
              if (!v.userId.includes(this.user.userId)) {
                v.userId = this.user.userId + ',' + v.userId;
              }
            } else { // usuario anónimo
              if (!v.userId.includes('unknown')) {
                v.userId = 'unknown,' + v.userId;
              }
            }
            //this.home.visitas.push(visita);
          } else { // primera visita del día
            var visita = new Visitas();
            visita.count = 1;
            visita.date = today;
            if (this.state) {
              visita.userId = this.user.userId;
            } else {
              visita.userId = 'unknown';
            }
            this.home.visitas.push(visita);
          }
        })
      } else { // primera visita del anuncio
        this.home.visitas = []
        var visita = new Visitas();
        visita.count = 1;
        visita.date = today;
        if (this.state) {
          visita.userId = this.user.userId;
        } else {
          visita.userId = 'unknown';
        }
        this.home.visitas.push(visita);
      }
      this.home.visitasAsString = JSON.stringify(this.home.visitas).split(',null').join('');
      this.subscriptions.push(this.homeService.updateHome(this.home).subscribe({
        next: () => {
        },
        error: () => {
        }
      }));
    }, 1000);


  }

  getHomeFromUrl() {
    if (this.route.snapshot.paramMap.get('id') && this.route.snapshot.fragment) {
      this.dto.id = this.route.snapshot.paramMap.get('id');
      this.dto.model = this.route.snapshot.fragment;
    }
    var homeDto = JSON.stringify(this.dto);
    this.subscriptions.push(this.homeService.gethome(this.dto.id, homeDto).subscribe({
      next: (res) => {
        this.home = this.homeService.performHome(res);
        if (this.home.energyCert) {
          this.energyImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.home.energyCert.imageUrl);
        }
        if (this.home.vistasDespejadas) {
          this.views = this.home.vistasDespejadas.split(',');
        }
        if (this.home.tipos) {
          this.projectFeatures = this.home.tipos.split(',');
        }
        if (this.state) {
          this.user = this.authenticationService.getUserFromLocalCache();
        }
        // stardard: 60, pro: 90
        var customIndex;
        if (this.propertyOwner) {
          if (!this.propertyOwner.isPro) {
            if (this.home.images.length > 60) {
              customIndex = 60;
            } else {
              customIndex = this.home.images.length;
            }
          } else {
            customIndex = this.home.images.length;
          }
        }
        setTimeout(() => {
          this.home.images = JSON.parse(this.home.imagesAsString);
          var y = document.getElementById('skeleton-section');
          y.style.display = 'none';
          for (let i = 0; i < customIndex; i++) {
            const src = this.home.images[i].imageUrl + i + '.jpg';
            const caption = i + 1 + ' / ' + customIndex;
            const thumb = this.home.images[i].imageUrl + i + '.jpg';
            const album = {
              src: src,
              caption: caption,
              thumb: thumb,
            };
            this._albums.push(album);
          }
        }, 1300);
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
        this.timelineStatus();
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
        console.log('3')
        this.router.navigateByUrl('/home');
      }
    }))
  }

  cuoreLike(id: string) {
    if (this.state) {
      var selectedHome = this.home;
      var userValue = this.user.userId;
      if (selectedHome.likeMeForever.includes(userValue)) {
        selectedHome.likeMeForever.forEach((item, index) => {
          if (item == userValue) selectedHome.likeMeForever.splice(index, 1);
        });
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: (res: Home) => {
            var homeaux = this.homeService.performHome(res);
            this.home.likeMeForever = [...homeaux.likeMeForever]
            this.homeService.addHomeToLocalCache(this.home);
            this.createMessage("success", "Borrado desde favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      } else {
        this.home.likeMeForever.push(userValue);
        this.home.likeMeForeverAsString = this.home.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(this.home).subscribe({
          next: (res: Home) => {
            var homeaux = this.homeService.performHome(res);
            this.home.likeMeForever = [...homeaux.likeMeForever]
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
    this._lightbox.open(this._albums, index, { centerVertically: true, wrapAround: true });
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

  timelineStatus() {
    if (this.home.porcentajeTerminado == 0) {
      this.inicioVentas = nzStatus.wait;
      this.inicioConstruccion = nzStatus.wait;
      this.mudandose = nzStatus.wait;
    } else if (this.home.porcentajeTerminado > 0 && this.home.porcentajeTerminado < 100) {
      this.inicioVentas = nzStatus.finish;
      this.inicioConstruccion = nzStatus.wait;
      this.mudandose = nzStatus.wait;
    } else if (this.home.porcentajeTerminado == 100) {
      this.inicioVentas = nzStatus.finish;
      this.inicioConstruccion = nzStatus.finish;
      this.mudandose = nzStatus.finish;
    }
  }


  setAdRoute(
    latitud: string,
    longitud: string,
    color: string,
    customIcon: any,
    index: number,
    el: HTMLElement
  ) {
    el.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });
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
      this.waypointsTo = destination.latLng;
      this.mapAdd.fitBounds(L.latLngBounds([this.home.lat, this.home.lng], this.waypointsTo));
    });
    this.mapEvents.add('control');
    control._container.style.display = "None";
  }

  public contactMessage() {
    this.refreshing = true;
    this.showLoading = true;
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
    this.subscriptions.push(this.emailService.EmailMessage(json).subscribe({
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
    this.showLoading = false;
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
