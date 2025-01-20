import {
  PropertyTo, HouseType, Bedrooms, Bathrooms, BadgeDestacar, PropertyState, Enseñanza, Institucion,
  RamasConocimiento, EmisionesCO2, ConsumoEnergetico, TipoDeVia, Orientacion, Provincias, PrecioMinimoAlquiler,
  PrecioMaximoAlquiler, PrecioMinimoVenta, PrecioMaximoVenta, Superficie, Views, PropertyShareType, CarPlaces,
  PropertyTypeSelectHeader,
  HouseTypeFilters,
  PropertyFilterOptions,
  Model,
  ProjectFeatures,
  NearlyServices,
  OtherValues,
  PrecioMaximoVentaEdificio,
  Disposicion,
  Climatizacion,
  DistribucionOficina,
} from './../class/property-type.enum';
import { UserService } from './../service/user.service';
import { AfterViewInit, Component, ElementRef, Inject, Input, isDevMode, OnDestroy, OnInit, Output, QueryList, Renderer2, Signal, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { marker, LatLng, circleMarker } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.locatecontrol';
import {
  tileLayerSelect, tileLayerCP, tileLayerWMSSelect, tileLayerHere, tileLayerWMSSelectIGN, tileLayerTransportes,
  Stadia_OSMBright, OpenStreetMap_Mapnik, CartoDB_Voyager, Thunderforest_OpenCycleMap, Jawg_Sunny, tileLayerGoogleStreets,
  cartocdnDarkAll
} from '../model/maps/functions';
import {
  grayIcon, greenIcon, grayPointerIcon, homeicon, beachIcon, airportIcon, marketIcon, subwayIcon,
  busIcon, schoolIcon, universityIcon, fancyGreen, priceIcon, luxuryRed,
} from '../model/maps/icons';
import { UserComponent } from '../components/user/user.component';
import { NotificationService } from '../service/notification.service';
import { AuthenticationService } from '../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from '../class/notification-type.enum';
import * as L from 'leaflet';
import { HomeService } from '../service/home.service';
import { Aeropuerto, Beach, Bus, Home, Metro, Supermercado, Universidad, HomeImage, Colegio, HomeFilterRequest } from '../model/home';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { BehaviorSubject } from 'rxjs';
import { FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import { APIKEY } from 'src/environments/environment.prod';
import * as $ from 'jquery';
import Axios from 'axios-observable';
import { BsModalService } from 'ngx-bootstrap/modal';
import wordsCounter from 'word-counting'
import { MatSidenav } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ImageService } from '../service/image.service';
import { HomeDto } from '../model/dto/home-dto';
import _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import GestureHandling from 'leaflet-gesture-handling';
import {
  ngLock,
  ngUnlock,
  withNgLockContext,
  ngLockChanges,
  NgLockModule,
  ngLockSignal,
  ngLockObservable,
  ngIsLock,
  ngLockElementByComponentProperty,
} from 'ng-lock';
import slug from 'slug'
import { addDays, isAfter, isBefore, parseISO, format, endOfDay } from 'date-fns';
import { cssPathHome } from '../model/performance/css-styles';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { initFlowbite } from 'flowbite';
import { PrimeNG } from 'primeng/config';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', 'custom-leaflet.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class HomeComponent extends UserComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    protected homeService: HomeService,
    protected sanitizer: DomSanitizer,
    protected modalServiceBs: BsModalService,
    @Inject(DOCUMENT) document: Document,
    renderer2: Renderer2,
    protected primeng: PrimeNG,
    messageService: MessageService,
    protected nzMessage: NzMessageService,
    protected modalSevice: NgbModal,
    protected imageService: ImageService,
    protected notification: NzNotificationService,
    protected breakpointObserver: BreakpointObserver
  ) {
    super(router, authenticationService, userService, notificationService, route, toastr, document,
      renderer2, primeng, messageService, imageService);
  }

  loginButtonsSmallSize: boolean = false;
  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 1117px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          //console.log('Viewport width is 1117px or greater!');
          this.loginButtonsSmallSize = false;
        } else {
          this.loginButtonsSmallSize = true;
          //console.log('Viewport width is less than 1117px!');
        }
      });
    if (this.state) {
      if (this.user.isPro) {
        this.config.maxFiles = 90;
      } else {
        this.config.maxFiles = 60;
      }
    }
  }

  map!: L.Map; // map allocates homes
  map2!: L.Map; // map geocoding search location
  map3!: L.Map; // map to set nearly services
  map4!: L.Map; // map geocoding search location new project
  lg = new L.LayerGroup(); // para añadir un nuevo marker
  markerPoint!: L.Marker;
  markerHouse!: L.Marker; // punto de referencia para los servicios
  boxedPoints: number[] = [-3.759897952608216, 40.392126294282974, -3.6456573062459112, 40.43721717752451];
  userLocationCoords!: L.LatLng; // app user coordinates at the beggining
  waypointsFrom!: L.LatLng; // coordinates where the user wants to put his house
  waypointsTo!: L.LatLng; // temp coordinates to put any service
  markerClusterGroup = new L.MarkerClusterGroup();
  public adTitle = new BehaviorSubject<string>('Nueva propiedad');
  public adTitleAction$ = this.adTitle.asObservable();
  home: Home = new Home();
  selectedHome: Home = new Home();
  homeDto: HomeDto = new HomeDto();
  homeFiltersRequest: HomeFilterRequest = new HomeFilterRequest();
  homes: Home[] = [];
  // enums para los select
  public badge: string[] = Object.values(BadgeDestacar);
  public bathRooms: string[] = Object.values(Bathrooms);
  public bedrooms: string[] = Object.values(Bedrooms);
  public calificacion_emisiones: string[] = Object.values(EmisionesCO2);
  public calificacion_consumo: string[] = Object.values(ConsumoEnergetico);
  public carPlaces: string[] = Object.values(CarPlaces);
  public climatizacion: string[] = Object.values(Climatizacion);
  public condicion: string[] = Object.values(PropertyTo);
  public condicion2: string[] = Object.values(PropertyShareType);
  public condicionFiltros: string[] = Object.values(PropertyFilterOptions);
  public condicionHeader: string[] = Object.values(PropertyTypeSelectHeader);
  public disposicion: string[] = Object.values(Disposicion);
  public distribucionOficina: string[] = Object.values(DistribucionOficina);
  public ensenyanza: string[] = Object.values(Enseñanza);
  public institucion: string[] = Object.values(Institucion);
  //public model: string[] = Object.values(Model);
  public nearlyServices: string[] = Object.values(NearlyServices);
  public orientacion: string[] = Object.values(Orientacion);
  public otherValues: string[] = Object.values(OtherValues);
  public precioMinimoAlquiler: string[] = Object.values(PrecioMinimoAlquiler);
  public precioMinimoVenta: string[] = Object.values(PrecioMinimoVenta);
  public precioMaximoAlquiler: string[] = Object.values(PrecioMaximoAlquiler);
  public precioMaximoVenta: string[] = Object.values(PrecioMaximoVenta);
  public precioMaximoVentaEdificio: string[] = Object.values(PrecioMaximoVentaEdificio);
  public projectFeatures: string[] = Object.values(ProjectFeatures);
  public propertyState: string[] = Object.values(PropertyState);
  public provincias: string[] = Object.values(Provincias);
  public ramas: string[] = Object.values(RamasConocimiento);
  public superficie: string[] = Object.values(Superficie);
  public tipo_de_via: string[] = Object.values(TipoDeVia);
  public tipo: string[] = Object.values(HouseType);
  public tipoFilters: string[] = Object.values(HouseTypeFilters);
  public vistas: string[] = Object.values(Views);
  protected styleUser: HTMLLinkElement[] = [];

  decision: any[] = [
    { name: 'Aprox.', value: false },
    { name: 'Exacta', value: true }
  ];
  page: number = 1;
  modalFooterNull = null;
  shinePopup: boolean = false; //skeleton
  popupOpenViviendaId: string;
  cardCheckedViviendaId: string;
  anyPopupOpen: boolean = false;
  images = new Array<HomeImage>();// new Array(30).fill('');
  routerLinkId: number = 0;
  routerLinkModel: string;
  routerLinkQueryParams: string;
  filterRentSalePriceFlag: string = 'Venta';
  mapRentSalePriceFlag: string = 'Venta';
  segmentedIndex: string = 'Venta';
  searchOption: string = 'Vivienda';
  sidebarVisible: boolean = false;
  // method must know what array needs to work
  serviceGoal: string; // aim service
  indexGoal: number; // array index
  buttonBefore: string; // button calls to save
  buttonAfter: string; // show route
  buttonDelete: string; // invert buttons load save
  row: number; // index save load matrix
  col: number;

  // to set nearly services
  colegio: Colegio[] = [
    { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', },
  ];

  universidad: Universidad[] = [
    { lat: '', lng: '', nombre: '', rama: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', rama: '', institucion: '', web: '', distancia: '', tiempo: '', },
    { lat: '', lng: '', nombre: '', rama: '', institucion: '', web: '', distancia: '', tiempo: '', },
  ];

  autobus: Bus[] = [
    { lat: '', lng: '', parada: '', lineas: '', distancia: '', tiempo: '' },
    { lat: '', lng: '', parada: '', lineas: '', distancia: '', tiempo: '' },
    { lat: '', lng: '', parada: '', lineas: '', distancia: '', tiempo: '' },
  ];
  metro: Metro[] = [
    { lat: '', lng: '', parada: '', lineas: '', distancia: '', tiempo: '' },
  ];
  mercados: Supermercado[] = [
    { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' },
    { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' },
    { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' },
  ];
  aeropuerto: Aeropuerto[] = [
    { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' },
  ];
  beach: Beach[] = [
    { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' },
  ];

  // enable-disable textfields
  stateTextfields = Array.from({ length: 4 }, () => new Array(6).fill(false));
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

  resizeStyleListSidenav = { "max-width": `50%` };

  // modal new property title 
  public setAdTitle(adTitle: string): void {
    this.adTitle.next(adTitle);
  }

  public hideNavDropdown(aim: string) {
    this.clickButton('nav-toggle'); // para móviles
    $('.show-dropdown').removeClass()
    $('#' + aim).css('height', '0px');
    setTimeout(() => {
      $('#' + aim).removeAttr('style')
    }, 900);
  }

  cardSkeletonOn: boolean = false;
  private scroll(el: string) {
    this.cardSkeletonOn = true;
    setTimeout(() => {
      this.cardSkeletonOn = false;
      document.querySelector('#' + el).scrollIntoView({
        behavior: 'smooth', block: "center"
      });
      if (window.onscrollend !== undefined) {
        document.getElementById(el).classList.add('border-4');
        document.getElementById(el).classList.add('border-secondary-subtle');
      }
    }, 800);
  }

  /*
  *   Llamar en funcion de searchOption tiene que ser así porque si el model es Other recibirá una lista distinta para que funcione el filtrado
  * */
  public restoreMap() {
    this.lg.clearLayers();
    if (this.boxedPoints) {
      if (this.searchOption != 'Vivienda') {
        this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',model@=*Other' + ',&sorts=');
      } else {
        this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',&sorts=')
      }
    } else {
      this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
    } if (this.mapEvents.has('control')) {
      this.map3.eachLayer(function (layer) {
        layer.remove();
      });
      tileLayerGoogleStreets().addTo(this.map3);
      this.mapEvents.delete('control');
      this.markerHouse.addTo(this.map3);
    }
    this.disableMapEvents = false;
  }

  @ViewChild('newMarkerForm') newMarkerForm: FormGroupDirective;
  @ViewChild('element') element: ElementRef;// show/hide 2nd modal
  @ViewChild('map_3') map_3?: ElementRef;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  protected ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  public openToogleModal(flag: boolean) {
    if (flag) {
      if (this.waypointsFrom == null || this.waypointsFrom == undefined) { // if(this.waypointsFrom) da error y no carga el mapa
        // remove to production
        this.waypointsFrom = this.userLocationCoords;
      }
      this.waypointsTo = this.waypointsFrom;
      this.element.nativeElement.classList.add('modal-open');
      // cargar el siguiente mapa
      if (this.map3 == undefined) {
        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        this.map3 = L.map('map_3', {
          renderer: L.canvas(),
          gestureHandling: false,
          invalidateSize: true,
        }).setView([this.waypointsFrom.lat, this.waypointsFrom.lng], 15);
        //Stadia_OSMBright().addTo(this.map3);
        tileLayerGoogleStreets().addTo(this.map3);
        this.markerHouse = new L.marker(this.waypointsFrom, {
          draggable: false,
          icon: homeicon,
        });
        this.markerHouse.addTo(this.map3);
      }
    } else {
      this.element.nativeElement.classList.remove('modal-open');
    }
  }

  // rutas próximas
  public setRoute(
    color: string,
    customIcon: any,
    serviceParam: string,
    index: number,
    idButtonBefore: string,
    idButtonAfter: string,
    idButtonDelete: string,
    iRow: number,
    jCol: number,
    el: HTMLElement
  ) {
    el.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });
    //this.messageService.add({ severity: 'success', summary: 'Arrastra el marcador', detail: 'Y pulsa para guardar' });
    this.notification.blank(
      'Arrastra el marcador',
      'Y pulsa para guardar',
      { nzPlacement: 'topRight', nzDuration: 2300, nzStyle: { 'border-radius': '.5em', 'background-color': '#3a3b3c', 'color': 'white', 'margin-top': '2em' } }
    );
    this.waypointsTo = this.waypointsFrom;
    this.serviceGoal = serviceParam;
    this.indexGoal = index;
    this.buttonBefore = idButtonBefore;
    this.buttonAfter = idButtonAfter;
    this.buttonDelete = idButtonDelete;
    this.row = iRow;
    this.col = jCol;
    this.customIcon = customIcon;
    if (this.mapEvents.has('control')) {
      this.map3.eachLayer(function (layer) {
        layer.remove();
      });
      tileLayerGoogleStreets().addTo(this.map3);
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
        L.latLng(this.waypointsFrom.lat, this.waypointsFrom.lng),
        L.latLng(this.waypointsTo.lat - .001, this.waypointsTo.lng + .001),
      ],
      createMarker: function (i, wp, nWps) {
        if (i == 0) {
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
          }).bindPopup(
            `
            <div class="buttons has-addons is-centered d-flex flex-start" style="left:-0.18em;top:0;bottom:0;position:absolute; ">
              <button class="button is-link" onclick="saveService()" type="button" >Guardar</button>
              <button class="button is-link is-light" onclick="closeSmallPopup()" type="button" >Cancelar</button>
            </div>
            `, {
            offset: [6, -44],
            //className: '.elementRouteX ',
          }
          );
        }
      },
      routeWhileDragging: true,
      language: 'es',
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: color, weight: 4 }],
      },
    });
    this.map3.addControl(control);
    control.on('routesfound', (e) => {
      var routes = e.routes;
      var summary = routes[0].summary;
      //this.waypointsTo=e.waypoints;
      console.log(
        (summary.totalDistance / 1000).toFixed(2) +
        ' km. ' +
        Math.round((summary.totalTime % 3600) / 60) +
        ' minutos'
      );
      var waypoints = e.waypoints || [];
      var destination = waypoints[waypoints.length - 1];
      this.waypointsTo = destination.latLng;
      console.log(this.waypointsTo);
      switch (this.serviceGoal) {
        case 'colegio':
          this.colegio[this.indexGoal].lat = this.waypointsTo.lat;
          this.colegio[this.indexGoal].lng = this.waypointsTo.lng;
          this.colegio[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.colegio[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'universidad':
          this.universidad[this.indexGoal].lat = this.waypointsTo.lat;
          this.universidad[this.indexGoal].lng = this.waypointsTo.lng;
          this.universidad[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.universidad[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'autobus':
          this.autobus[this.indexGoal].lat = this.waypointsTo.lat;
          this.autobus[this.indexGoal].lng = this.waypointsTo.lng;
          this.autobus[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.autobus[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'metro':
          this.metro[this.indexGoal].lat = this.waypointsTo.lat;
          this.metro[this.indexGoal].lng = this.waypointsTo.lng;
          this.metro[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.metro[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'mercados':
          this.mercados[this.indexGoal].lat = this.waypointsTo.lat;
          this.mercados[this.indexGoal].lng = this.waypointsTo.lng;
          this.mercados[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.mercados[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'aeropuerto':
          this.aeropuerto[this.indexGoal].lat = this.waypointsTo.lat;
          this.aeropuerto[this.indexGoal].lng = this.waypointsTo.lng;
          this.aeropuerto[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.aeropuerto[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'beach':
          this.beach[this.indexGoal].lat = this.waypointsTo.lat;
          this.beach[this.indexGoal].lng = this.waypointsTo.lng;
          this.beach[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.beach[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
      }
    });
    this.mapEvents.add('control');
    //control.on('waypointschanged', ()=>);
    /*this.mp.on('move', () => (this.waypointsFrom = this.mp.getLatLng()));
    this.mp.on('moveend', () => console.log(this.waypointsFrom));
    this.mp.on('dragend', () => this.mp.openPopup());*/
  }

  propertyGuidance(signal: string): string {
    if (signal == 'Norte') {
      return 'N';
    } else if (signal == 'Noreste') {
      return 'N/E';
    } else if (signal == 'Noroeste') {
      return 'N/O';
    } else if (signal == 'Este') {
      return 'E';
    } else if (signal == 'Oeste') {
      return 'O';
    } else if (signal == 'Sureste') {
      return 'S/E';
    } else if (signal == 'Suroeste') {
      return 'S/O';
    } else if (signal == 'Sur') {
      return 'S';
    } else return null;
  }

  defineModel(houseType: string): string {
    if (houseType == 'Piso' || houseType == 'Apartamento' || houseType == 'Estudio' || houseType == 'Ático' || houseType == 'Duplex') {
      return 'Flat';
    } else if (houseType == 'Chalet' || houseType == 'Adosado' || houseType == 'Pareado' || houseType == 'Casa Rústica' || houseType == 'Villa') {
      return 'House';
    } else if (houseType == 'Habitación') {
      return 'Room';
    } else if (houseType == 'Proyecto nuevo') {
      return 'NewProject'
    } else if (houseType == 'Oficina' || houseType == 'Edificio' || houseType == 'Negocio' || houseType == 'Suelo'
      || houseType == 'Garage' || houseType == 'Trastero' || houseType == 'Local o nave') {
      return 'Other'
    } else if (houseType == 'Vacacional') {
      return 'HolidayRent';
    } else return null;
  }

  saveService(flag: string) {
    if (flag == 'home') {
      var x = document.getElementById(this.buttonBefore);
      x.style.display = 'none';
      x = document.getElementById(this.buttonAfter);
      x.style.display = 'block';
      x = document.getElementById(this.buttonDelete);
      x.style.display = 'block';
    }
    this.stateTextfields[this.row][this.col] = true;
    console.log(this.stateTextfields);
    if (this.mapEvents.has('control')) {
      this.map3.eachLayer(function (layer) {
        layer.remove();
      });
      tileLayerGoogleStreets().addTo(this.map3);
      this.mapEvents.delete('control');
    }
    this.markerHouse = new L.marker(this.waypointsFrom, {
      draggable: false,
      icon: homeicon,
    });
    this.markerHouse.addTo(this.map3);
    if (flag == 'home') {
      let top = document.getElementsByClassName('body')[0];
      if (top !== null) {
        top.scrollIntoView();
        top = null;
      }
    } else if (flag == 'user-pro') {
      let top = document.getElementsByClassName('mobility-modal')[0];
      if (top !== null) {
        top.scrollIntoView();
        top = null;
      }
    }
  }

  reRackService(row: number, col: number, btnBeforeId: string, btnAfterId: string, btnDltId: string) {
    console.log(btnBeforeId)
    var x = document.getElementById(btnBeforeId); //  array:string, index:number,
    x.style.display = 'block';
    x = document.getElementById(btnAfterId);
    x.style.display = 'none';
    x = document.getElementById(btnDltId);
    x.style.display = 'none';
    this.stateTextfields[row][col] = false;
    console.log(row + ' ' + col);
  }

  resizeMap() {
    setTimeout(() => {
      this.map3.invalidateSize();
    }, 300);
  }

  // modals ant-design
  policyModal: boolean = false;
  restoreModal: boolean = false;
  isOkLoading: boolean = false;
  joinUsModal: boolean = false;
  joinUsModalAd: boolean = false;
  mortgageModal: boolean = false;
  cityModal: boolean = false;
  showModal(modal: string): void {
    switch (modal) {
      case 'privatePolicy':
        this.policyModal = true;
        break;
      case 'joinUsModal':
        this.joinUsModal = true;
        break;
      case 'restoreModal':
        this.restoreModal = true;
        break;
      case 'joinUsModalAd':
        this.joinUsModalAd = true;
        break;
      case 'mortgageModal':
        this.mortgageModal = true;
        break;
      case 'cityModal':
        this.cityModal = true;
        break;
    }
  }

  handleOk(method: string): void {
    this.isOkLoading = true;
    if (method == 'privatePolicy') {
      setTimeout(() => {
        this.policyModal = false;
        this.isOkLoading = false;
      }, 500);
    } else if (method == 'joinUsModal') {
      setTimeout(() => {
        this.joinUsModal = false;
        this.isOkLoading = false;
      }, 500);
    } else if (method == 'restoreModal') {
      setTimeout(() => {
        this.restoreModal = false;
        this.isOkLoading = false;
      }, 500);
    } else if (method == 'joinUsModalAd') {
      setTimeout(() => {
        this.joinUsModalAd = false;
        this.isOkLoading = false;
      }, 500);
    } else if (method == 'mortgageModal') {
      setTimeout(() => {
        this.mortgageModal = false;
        this.isOkLoading = false;
      }, 500);
    } else if (method == 'cityModal') {
      setTimeout(() => {
        this.cityModal = false;
        this.isOkLoading = false;
      }, 500);
    }
  }

  handleCancel(method: string): void {
    if (method == 'privatePolicy') {
      this.policyModal = false;
    } else if (method == 'joinUsModal') {
      this.joinUsModal = false;
    } else if (method == 'restoreModal') {
      this.restoreModal = false;
    } else if (method == 'joinUsModalAd') {
      this.joinUsModalAd = false;
    } else if (method == 'mortgageModal') {
      this.mortgageModal = false;
    } else if (method == 'cityModal') {
      this.cityModal = false;
    }
  }

  // modal bootstrap. Hay que meter una plantilla/componente
  showBsModal() {
    const modalRef = this.modalServiceBs.show(`
      <div id="map_2"
          style="width: 100%; height: 25em; ">
      </div>`);
  }

  visiblePricingDrawer: boolean = false;
  showPricingDrawer() {
    this.visiblePricingDrawer = true;
  }

  closePricingDrawer() {
    this.visiblePricingDrawer = false;
  }

  sidebarFullScreenVisible: boolean = false;
  showFullScreenSidebar() {
    this.sidebarFullScreenVisible = true;
  }

  // garage select custom en Home & user-pro
  public carPlacesIndex = 0;
  @ViewChild('parkingOptional') parkingOptional: ElementRef;
  public addParkingPrice(input: HTMLInputElement): void {
    if (this.parkingOptional.nativeElement.value) {
      const value = input.value;
      if (this.carPlaces.indexOf(value) == -1) {
        this.carPlaces = [...this.carPlaces, input.value || `New item ${this.carPlacesIndex++}`];
      }
    }
  }

  addTextIdx = 0;
  @ViewChild('textOptional') textOptional: ElementRef;
  addText(input: HTMLInputElement): void {
    if (this.textOptional.nativeElement.value) {
      const value = input.value;
      if (this.badge.indexOf(value) === -1) {
        this.badge = [...this.badge, input.value || `New item ${this.addTextIdx++}`];
      }
    }
  }

  dateMonthFormat: Date; // para que no maree. El método asigna el mes
  fechaDisponibleAlquiler: any;
  setMonth(result: Date, flag: string) {
    if (result) {
      var disponible = result.toString().substring(4, 7);
      switch (disponible) {
        case 'Jan': this.fechaDisponibleAlquiler = 'Enero'; break;
        case 'Feb': this.fechaDisponibleAlquiler = 'Febrero'; break;
        case 'Mar': this.fechaDisponibleAlquiler = 'Marzo'; break;
        case 'Apr': this.fechaDisponibleAlquiler = 'Abril'; break;
        case 'May': this.fechaDisponibleAlquiler = 'Mayo'; break;
        case 'Jun': this.fechaDisponibleAlquiler = 'Junio'; break;
        case 'Jul': this.fechaDisponibleAlquiler = 'Julio'; break;
        case 'Aug': this.fechaDisponibleAlquiler = 'Agosto'; break;
        case 'Sep': this.fechaDisponibleAlquiler = 'Septiembre'; break;
        case 'Oct': this.fechaDisponibleAlquiler = 'Octubre'; break;
        case 'Nov': this.fechaDisponibleAlquiler = 'Noviembre'; break;
        case 'Dec': this.fechaDisponibleAlquiler = 'Diciembre'; break;
        default: break;
      }
      if (flag == 'home') {
        this.homeDto.disponibilidad = this.fechaDisponibleAlquiler;
        console.log(this.homeDto.disponibilidad);
      } else if (flag == 'user-pro') {
        this.home.disponibilidad = this.fechaDisponibleAlquiler;
        console.log(this.home.disponibilidad);
      }
    }
  }

  protected setTextfieldValue(
    optionSelected: string,
    optionMatch: string,
    textfieldIdOrngModel: NgModel,
    value: any
  ): any {
    if (optionSelected.match(optionMatch)) {
      textfieldIdOrngModel.reset();
    } else {
      return false;
    }
  }

  getSanitized() {
    return this.sanitizer.bypassSecurityTrustHtml('');
  }

  //modal primeng
  mainModal: boolean = false;
  newOtherModal: boolean = false;
  showDialog(flag: string) {
    if (flag == 'map') {
      this.mainModal = true;
      this.clickButton('tunedGeosearch');
    } else if (flag == 'new-other-modal') {
      this.newOtherModal = true;
    }
  }

  @ngLock({
    maxCall: 1
  })
  makeBeautifulGeosearch(e: any) {
    setTimeout(() => {
      var x = this.document.getElementsByClassName('reset')[0]
      x.classList.add('btn');
      x.classList.add('btn-primary');
      x.classList.add('h-100');
      x.classList.add('mb-2');
      x.classList.add('rounded-0');
      x.classList.add('rounded-end');
    }, 500);
  }

  closeDialog(flag: string) {
    if (flag == 'map') {
      this.mainModal = false;
    } else if (flag == 'new-other-modal') {
      this.newOtherModal = false;
      this.dropComponent.directiveRef.dropzone().files = [];
      this.dropComponent.directiveRef.reset();
    }
  }

  showCityResultHome() {
    if (this.homeDto.ciudad == null) {
      Swal.fire({
        text: "Introduzca la ciudad!",
        confirmButtonText: "Voy",
        confirmButtonColor: "#3D3D3D",
      });
    } else {
      var x = document.getElementsByClassName('provButton')[0];
      $('.is-danger').addClass('is-success');
      $('.is-success').removeClass('is-danger');
      this.homeDto.ciudad = this.homeDto.ciudad.split(' ')[0].replace(',', '');
      x.innerHTML = this.homeDto.ciudad;
      this.closeDialog('map');
    }
  }

  search: any;
  protected locationMap(mapId: string) {
    this.showDialog('map');
    if (this.map2 == null || this.map2 == undefined) {
      this.search = GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        popupFormat: ({ result }) => (this.homeDto.ciudad = result.label),
        searchLabel: 'Ciudad',
        resultFormat: ({ result }) => result.label,
        marker: {
          icon: grayPointerIcon,
          draggable: false,
        },
      });
      setTimeout(() => {
        this.map2 = L.map(mapId, { renderer: L.canvas() }).setView(
          [40.4380986, -3.8443428],
          5
        );
        tileLayerGoogleStreets().addTo(this.map2);
        this.map2.addControl(this.search);
        this.map2.zoomControl.setPosition('bottomleft');
      }, 300)
    }
  }

  newProjects: Home[] = [];
  loadNewProjects() {
    this.subscriptions.push(
      this.homeService.getHomesByQuery('model@=*NewProject,').subscribe({
        next: (res: Home[]) => {
          this.newProjects = [...res];
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    );
  }

  public loadMarkers(url: string) {
    this.ngOnDestroy();
    $(".leaflet-marker-icon").remove();
    this.map.closePopup();
    if (this.map.hasLayer(this.markerClusterGroup)) {
      this.map.removeLayer(this.markerClusterGroup);
    }
    this.markerClusterGroup = new L.markerClusterGroup({ removeOutsideVisibleBounds: true });
    this.loadNewProjects()
    //tileLayerSelect().addTo(map);
    //tileLayerWMSSelect().addTo(map);
    //tileLayerCP().addTo(map); // Codigos postales
    //tileLayerWMSSelectIGN().addTo(this.map);
    //Stadia_OSMBright().addTo(this.map);
    if (this.call < 1) {
      /*var baseLayers = {
        tileLayerGoogleStreets, cartocdnDarkAll
      }
      var overlays = {};
      L.control.layers(baseLayers, overlays).addTo(this.map);
      baseLayers['cartocdnDarkAll'].addTo(this.map);*/
      cartocdnDarkAll().addTo(this.map);
      //tileLayerGoogleStreets().addTo(this.map);
    }
    //tileLayerHere().addTo(this.map);
    this.subscriptions.push(
      this.homeService.getHomesByQuery(url).subscribe((data) => {
        data.map((Home) => {
          Home = this.homeService.performHome(Home);
          marker(
            [Home.lat, Home.lng],
            {
              icon: new L.DivIcon({
                className: 'custom-div-icon',
                html: `<div class="property-pill streamlined-marker-container streamlined-marker-position pill-color-forsale with-icon ${Home.viviendaId}"
                            role="link"
                            tabindex="-1"
                            data-test="property-marker">
                            
                            <div class="icon-text" style="display: inline-block; overflow: hidden;">${this.drawMarker(Home)}€</div>
                        </div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
              }),
            },
            { draggable: true, locateControl: true, bounceOnAdd: true }
          ).on('add', () => {
            if (Home.destacado && isBefore(new Date(), Home.destacado.featuredTo)) {
              $('<div class="pill-floating-label">destacado</div>').appendTo("." + Home.viviendaId);
            }
            if ((Home.precioInicial > Home.precioFinal) && Home.underPriceMarketAsString) {
              if ((Home.underPriceMarket.lessPrice) && (isBefore(new Date(), Home.underPriceMarket.lessPriceTo))) {
                $('<div class="icon-wrapper p-0"><svg data-testid="icon-arrow-down" viewBox="0 0 24 24" style="display:inline-block;width:1em;height:1em;font-size:1.4em;color:inherit;fill:currentColor" aria-hidden="true" focusable="false" class="reduced ml-1"><path d="M17.293 12.293a1 1 0 0 1 1.414 1.414l-1.414-1.414ZM12 19l.707.707a1 1 0 0 1-1.414 0L12 19Zm-6.707-5.293a1 1 0 1 1 1.414-1.414l-1.414 1.414ZM11 5a1 1 0 1 1 2 0h-2Zm7.707 8.707-6 6-1.414-1.414 6-6 1.414 1.414Zm-7.414 6-6-6 1.414-1.414 6 6-1.414 1.414ZM11 19V5h2v14h-2Z"></path></svg></div>').appendTo("." + Home.viviendaId);
              }
            }
            if ((Home.precioAlquilerInicial > Home.precioAlquiler) && Home.underPriceMarketAsString) {
              if ((Home.underPriceMarket.lessPrice) && (isBefore(new Date(), Home.underPriceMarket.lessPriceTo))) {
                $('<div class="icon-wrapper p-0"><svg data-testid="icon-arrow-down" viewBox="0 0 24 24" style="display:inline-block;width:1em;height:1em;font-size:1.4em;color:inherit;fill:currentColor" aria-hidden="true" focusable="false" class="reduced ml-1"><path d="M17.293 12.293a1 1 0 0 1 1.414 1.414l-1.414-1.414ZM12 19l.707.707a1 1 0 0 1-1.414 0L12 19Zm-6.707-5.293a1 1 0 1 1 1.414-1.414l-1.414 1.414ZM11 5a1 1 0 1 1 2 0h-2Zm7.707 8.707-6 6-1.414-1.414 6-6 1.414 1.414Zm-7.414 6-6-6 1.414-1.414 6 6-1.414 1.414ZM11 19V5h2v14h-2Z"></path></svg></div>').appendTo("." + Home.viviendaId);
              }
            }
            const date = new Date(Home.fechaCreacion)
            date.setDate(date.getDate() + 3);
            if (isBefore(new Date(), date)) {
              $('<div class="newer-box flags-wrapper"><div class="blue flag-item "><span class="" style="bottom:-.330em;position:relative;margin-left:.2em;margin-right:.1em;margin-top:.150em;font-weight:700;font-size:1em;">Nuevo</span></div></div>').appendTo("." + Home.viviendaId);
            }
          })
            .bindPopup(
              `
              <div class="reale1 row">
                <div class="reale2" col-sm-6>
                   <div class="reale3" >
                      <div class="reale5 d-none carousel-leaflet">
                        <div id="carouselExample" class="carousel slide " data-bs-interval="false">
                          <div class="carousel-inner popup-marker">
                          </div>
                          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Next</span>
                          </button>
                        </div>
                        <div class="brandingcontainer" id="brandingcontainer" style="display:none;"></div>
                      </div> <!-- reale5 -->
                      <div class="reale5 popup-image-skeleton-on">
                        <div class="w-100 h-100 skeleton-popup-image"></div>
                      </div> <!-- skeleton loader reale5 -->
                      <div class="col-sm-6 realeTextContainer d-none popup-data">
                        <p class="p_1">${Home.tipo}</p>
                         <div class="realeTextContainer_2">
                          <input onclick="cuoreLike()" class="red-heart-checkbox" id="cuore${Home.viviendaId}" type="checkbox">
                          <label for="cuore${Home.viviendaId}" class="float-end mr-3 mt-4 py-2"></label>
                         <p class="p_1_2 d-block mt-4">En ${Home.condicion}</p>
                            <p class="p_2"></p>
                            <a onclick="runPopup()" class="a_1">
                               <p class="p_3"></p>
                               <p class="p_4">${Home.distrito}, ${Home.ciudad}</p>
                            </a>
                            <div class="ul_features">
                              
                            </div>
                            <div class="p_features">
                            
                            </div>
                         </div> <!-- realeTextContainer2 -->
                      </div> <!-- realeTextContainer -->
                      <div class="col-sm-6 realeTextContainer data-skeleton-on">
                        <div class="skeleton-popup-image mt-3" style="width:85%;height:23px;border-radius:.5em"></div>
                        <div class="skeleton-popup-image" style="width:85%;height:1em;border-radius:.5em"></div>
                        <div class="skeleton-popup-image" style="width:85%;height:1em;border-radius:.5em"></div>
                        <div class="d-flex flex-row mb-2">
                          <div class="skeleton-popup-image mb-3 pl-0" style="width:15%;height:23px;border-radius:.5em"></div>
                          <div class="skeleton-popup-image mb-3 mx-auto" style="width:15%;height:23px;border-radius:.5em"></div>
                          <div class="skeleton-popup-image mb-3 mx-auto" style="width:15%;height:23px;border-radius:.5em"></div>
                          <div class="skeleton-popup-image mb-3 mr-5" style="width:15%;height:23px;border-radius:.5em"></div>
                        </div>
                      </div>
                   </div> <!-- reale3 -->
                   
                </div> <!-- reale2 -->
                
             </div> <!-- reale1 -->
             
              `,
              {
                maxWidth: 382,
                maxHeight: 152,
                /*removable: true,
                editable: true,*/
                /*direction: 'top',*/
                permanent: false,
                /*sticky: false,*/
                offset: [6, -99],
                opacity: 0,
                className: 'popupX',
              }
            )
            .on('click', () => {
              this.homeService.addHomeToLocalCache(Home),
                this.dynamicCarousel(Home.images),
                this.setPopupBranding(Home)
            })
            .on('popupopen', () => {
              this.routerLinkId = +Home.id;
              this.routerLinkModel = Home.model;
              var slugFest = Home.tipo + '-' + Home.calle + '-' + Home.distrito + '-' + Home.ciudad;
              this.routerLinkQueryParams = slug(slugFest, '-');
              this.popupOpenViviendaId = Home.viviendaId;
              this.anyPopupOpen = true;
              this.disableMapEvents = true;
              this.scroll('teaserTile' + Home.viviendaId);
              setTimeout(() => {// skeleton carousel
                var imgs = document.getElementsByClassName('carousel-leaflet')[0];
                imgs.classList.remove('d-none');
                imgs.classList.add('d-block');
                var skeletonImgs = document.getElementsByClassName('popup-image-skeleton-on')[0]
                skeletonImgs.classList.add('d-none');
                // skeleton data
                var data = document.getElementsByClassName('popup-data')[0];
                data.classList.remove('d-none');
                data.classList.add('d-block');
                var skeletonData = document.getElementsByClassName('data-skeleton-on')[0]
                skeletonData.classList.add('d-none');
                this.setCardLike()
              }, 400);
              this.subscriptions.push(this.homeService.getHomesByQuery('model@=*' + Home.model + ',' + 'viviendaId@=*' + Home.viviendaId + ',').subscribe({
                next: (res) => {
                  this.selectedHome = this.homeService.performHome(res[0]);
                  this.drawPopup(this.selectedHome);
                },
                error: () => { }
              })
              )
            }).on('popupclose', () => {
              this.anyPopupOpen = false;
              this.disableMapEvents = false;
              $('.border-4').removeClass('border-4');
              $('.border-secondary-subtle').removeClass('border-secondary-subtle');
            }
            ).addTo(this.markerClusterGroup.on('clusterclick', (a) => {

            }));
        })
        this.markerClusterGroup.addTo(this.map);
        this.homes = [...data];
        if (this.authenticationService.isUserLoggedIn()) {
          this.setCardLike();
        }
      }),
    );
  }

  @ngLock()
  cuoreLikeFeature(attr: string, hm: Home, e: MouseEvent) {
    if (this.state) {
      var selectedHome = this.homeService.performHome(hm);
      var userValue = this.user.userId;
      if (attr != 'popup') { // card calls
        this.cardCheckedViviendaId = attr;
      }
      if (selectedHome.likeMeForever.includes(userValue)) {
        selectedHome.likeMeForever.forEach((item, index) => {
          if (item == userValue) selectedHome.likeMeForever.splice(index, 1);
        });
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: (res: Home) => {
            this.homeService.addHomeToLocalCache(res);
            this.createMessage("success", "Borrado desde favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
        if (attr == 'popup') {
          this.clickButton(this.popupOpenViviendaId);
          ngUnlock(this.cuoreLikeFeature);
        } else {
          if (this.anyPopupOpen && this.popupOpenViviendaId === this.cardCheckedViviendaId) {
            var auxId = 'cuore' + this.cardCheckedViviendaId;
            const doc = document.getElementById(auxId) as HTMLInputElement;
            doc.click();
          }
          ngUnlock(this.cuoreLikeFeature);
        }
      } else { // not has it
        selectedHome.likeMeForever.push(userValue);
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: (res: Home) => {
            this.homeService.addHomeToLocalCache(res);
            this.createMessage("success", "Guardado en favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
        if (attr == 'popup') {
          this.clickButton(this.popupOpenViviendaId);
          ngUnlock(this.cuoreLikeFeature);
        } else {
          if (this.anyPopupOpen && this.popupOpenViviendaId === this.cardCheckedViviendaId) {
            var auxId = 'cuore' + this.cardCheckedViviendaId;
            const doc = document.getElementById(auxId) as HTMLInputElement;
            doc.click();
          }
          ngUnlock(this.cuoreLikeFeature);
        }
      }
    } else {
      if (attr != 'popup') { // card calls
        this.cardCheckedViviendaId = attr;
      }
      if (attr == 'popup') {
        var auxId = 'cuore' + this.popupOpenViviendaId;
        const doc = document.getElementById(auxId) as HTMLInputElement;
        doc.checked = false;
        //doc.click();
        this.joinUsModal = true;
      } else {
        const doc = this.document.getElementById(this.cardCheckedViviendaId) as HTMLInputElement;
        doc.checked = false;
        this.joinUsModal = true;
      }
      ngUnlock(this.cuoreLikeFeature);
    }
  }

  // nzMessages
  createMessage(type: string, content: string): void {
    this.nzMessage.create(type, content);
  }

  setPopupBranding(home: Home) {
    if (home.proColor) {
      setTimeout(() => {
        let brandingProUser = document.getElementsByClassName('brandingcontainer') as HTMLCollectionOf<HTMLElement>;
        if (brandingProUser.length != 0) {
          brandingProUser[0].style.display = "flex";
          brandingProUser[0].style.backgroundColor = home.proColor;
        }
        if (home.proImage != null || home.proImage != undefined) {
          $('<img class="branding-image-popup" src="' + home.proImage.imageUrl + '" >').appendTo('.brandingcontainer');
        }
      }, 200);
    }
  }

  dynamicCarousel(data: HomeImage[]) {
    setTimeout(() => {
      for (let j = 0; j < data.length; j++) {
        $('<div class="carousel-item anime"><img src="' + data[j].imageUrl + '"class="image-container"></div>').appendTo('.popup-marker');
      }
      $(".anime").first().addClass("active");
    }, 200);
  }

  // pinta el precio en los marker
  drawMarker(home: Home): string {
    if ((home.condicion == PropertyTo.Alquiler || home.condicion == PropertyTo.AlquiloYvendo) && this.mapRentSalePriceFlag == 'Alquiler') {
      return this.formatNumberWithCommas(home.precioAlquiler);
    } else if ((home.condicion == PropertyTo.Venta || home.condicion == PropertyTo.AlquiloYvendo) && (this.mapRentSalePriceFlag == 'Venta' || this.mapRentSalePriceFlag == 'Alquiler y venta')) {
      return this.formatNumberWithCommas(home.precioFinal);
    } else if (home.condicion == PropertyTo.Compartir) {
      return this.formatNumberWithCommas(home.precioAlquiler);
    }
  }

  drawPopup(h: Home) {
    // Marca el favorito si el usuario lo tenía guardado
    if (this.state) {
      if (h.likeMeForever.includes(this.user.userId)) {
        $('#cuore' + h.viviendaId).prop("checked", true);
      }
    }
    // Pinta el precio de venta en todos los modelos menos NewProject
    if ((h.model != Model.NewProject) && (h.condicion == PropertyTo.Venta)) {
      $('.p_2').text(this.formatNumberWithCommas(h.precioFinal) + '€');
      //$('.p_1_2').text('En ' + h.condicion);
      // Pinta el precio de venta en NewProject justo con todos sus detalles 
    } else if (h.model == Model.NewProject) {
      setTimeout(() => {
        $('.p_2').append($(`<span class="tagProjectPrice mt-1">Desde</span>`));
        var price = document.getElementsByClassName('p_2')[0];
        var span = document.createElement('span');
        span.className = 'p_2';
        span.innerText = this.formatNumberWithCommas(h.precioFinal) + '€';
        span.style.marginLeft = '2em';
        price.appendChild(span);
        //
        if (h.antiguedad) {
          $('<span class="chip-popup gray"><ion-icon style="font-size:1.1em; position:relative;" src="assets/svg/white-badge-hammer.svg"></ion-icon>&nbsp;' + this.selectedHome.antiguedad + '</span>&npsp;').appendTo('.ul_features');
        } else {
          $('<span class="chip-popup success"><ion-icon style="font-size:1.1em; position:relative;"  src="assets/svg/white-badge-calendar.svg"></ion-icon>&nbsp;' + this.selectedHome.finDeObra + '</span>&npsp;').appendTo('.ul_features');
        }
        if (this.selectedHome.habitacionesDesde && this.selectedHome.habitacionesHasta) {
          $('<span class="chip-popup bleue ml-1"><ion-icon style="font-size:1.1em; position:relative;" src="assets/svg/white-badge-bed2.svg"></ion-icon>&nbsp;' + this.selectedHome.habitacionesDesde + '-' + this.selectedHome.habitacionesHasta + '</span>&npsp;').appendTo('.ul_features');
        }
        if (this.selectedHome.superficieDesde && this.selectedHome.superficieHasta) {
          $('<span class="chip-popup purple ml-1"><ion-icon style="font-size:1.1em; position:relative;" src="assets/svg/white-badge-size.svg"></ion-icon>&nbsp;' + this.selectedHome.superficieDesde + '-' + this.selectedHome.superficieHasta + 'm²</span>&npsp;').appendTo('.ul_features');
        }
        var x = document.getElementsByClassName('p_features')[0];
        x.classList.add("mt-2");
      }, 300)
      // pinta el precio de alquiler
    } else if (h.condicion == PropertyTo.Alquiler) {
      $('.p_2').text(this.formatNumberWithCommas(h.precioAlquiler) + '€');
      $('.p_1_2').text('En ' + h.condicion);
      // pinta el precio de alquiler y de venta
    } else if (h.condicion == PropertyTo.AlquiloYvendo) {
      $('<div class="p_2Prices">' + this.formatNumberWithCommas(h.precioFinal) + '€' + '<span style="color:#d9d9d9;">&nbsp;<i class="bi bi-grip-vertical"></i>&nbsp;</span>' + this.formatNumberWithCommas(h.precioAlquiler) + '€</div>').appendTo('.p_2');
      $('.p_1_2').text('En ' + h.condicion);
      // pinta el precio para compartir
    } else if (h.condicion == PropertyTo.Compartir) {
      $('.p_2').text(this.formatNumberWithCommas(h.precioAlquiler) + '€');
      $('.p_1_2').text(h.condicion + ' vivienda');
    }
    // Pinto las viviendas
    if (h.model != Model.NewProject && h.model != Model.Other) {
      $('<div class="popup-features d-flex flex-start" id="popup-features"><ion-icon style="font-size:1em; position:relative;" src="assets/svg/bed-horizontal.svg"></ion-icon>&nbsp;<span class="numbers-font mr-2" style="font-size:0.9em;color:#b4b4b4;">' + h.habitaciones + '</span>' +
        '<ion-icon style="font-size:1em; position:relative;" src="assets/svg/bath_tub.svg"></ion-icon>&nbsp;<span class="numbers-font mr-2" style="font-size:0.9em;color:#b4b4b4;">' + h.aseos + '</span>' +
        '<ion-icon style="font-size:1em; color:#666;" src="assets/svg/size-popup.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + h.superficie + "m²" + '</span>&nbsp;&nbsp;</div>'
      ).appendTo('.ul_features');
      if (h.garage > 0) {
        if (h.garage > 10) {
          $('<ion-icon style="font-size:1em; position:relative;" src="assets/svg/car-popup.svg"></ion-icon><ion-icon style="color:#7ce800; margin-top:2px;" name="add-outline"></ion-icon><span class="numbers-font" style="color:#7ce800;font-size:0.9em;">'
            + this.formatNumberWithCommas(h.garage) + '€</span>').appendTo('.p_features');
        } else {
          $('<ion-icon style="font-size:1.1em; position:relative;" src="assets/svg/car-popup.svg"></ion-icon><span class="numbers-font" style="color:#b4b4b4;">&nbsp;'
            + h.garage + '</span>').appendTo('.p_features');
        }
      }
      if (h.piso != null || h.piso != undefined) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; position:relative;" src="assets/svg/stairs-tab.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + h.piso + '</span></div>').appendTo('.popup-features');
        if (h.ascensor) {
          $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; position:relative; margin-left:.180em; " src="assets/svg/popup-elevator.svg"></ion-icon></div>').appendTo('.popup-features');
        }
      }
    }
    // Pinto Other -> Oficinas; sapphire blue
    if (h.model == Model.Other && h.tipo == 'Oficina') {
      $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; color:#0fs2ba;" src="assets/svg/size-popup-office.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#0fs2ba;">' + h.superficie + "m²" + '</span>&nbsp;&nbsp;</div>').appendTo('.ul_features');
      if (h.aireAcondicionado) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; color:#0fs2ba;" src="assets/svg/air-conditioner-office.svg"></ion-icon>&nbsp;</div>').appendTo('.ul_features');
      }
      if (h.aparcamientos) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; color:#0fs2ba;" src="assets/svg/parking-office-blue.svg"></ion-icon>&nbsp;</div>').appendTo('.ul_features');
      }
      if (h.controlDeAccesoPersonal) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; color:#0fs2ba;" src="assets/svg/turnstiles-office-blue.svg"></ion-icon>&nbsp;</div>').appendTo('.ul_features');
      }
      if (h.falsoTecho) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; color:#0fs2ba;" src="assets/svg/ceiling-office-blue.svg"></ion-icon>&nbsp;</div>').appendTo('.ul_features');
      }
      // p_features
      if (h.piso != null || h.piso != undefined) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; position:relative;" src="assets/svg/stairs-tab-blue.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#0fs2ba;">' + h.piso + '</span></div>').appendTo('.p_features');
        if (h.ascensor) {
          $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; position:relative; margin-left:.180em; " src="assets/svg/popup-elevator-blue.svg"></ion-icon></div>').appendTo('.p_features');
        }
      }
    }
    // Común


    if (h.prototipo == 'Vivienda') {
      var playa: Beach[] = JSON.parse(h.distanciaAlMar);
      if (playa[0].distancia.length) {
        $('<div class="d-flex flex-start">&nbsp;&nbsp;<ion-icon style="font-size:1em; position:relative;" src="assets/svg/sea.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + playa[0].distancia + '</span></div>&nbsp;').appendTo('.p_features');
      }
    }

    if (h.destacar) {
      $(' <div class="listing-status"><div class="listing-status-item" id="' + h.viviendaId + 'nota-simple' + '">' + h.destacar + '</div></div>').appendTo('.carousel-leaflet');
      if (h.colorDestacar) {
        $('#' + h.viviendaId + 'nota-simple').css("background-color", h.colorDestacar);
      }
    }



    if (!h.direccionAproximada) {
      $('.p_3').text('Ubicación aprox.');
    } else if (h.numero != null) {
      $('.p_3').text(h.tipoDeVia + ' ' + h.calle + ' ' + h.numero + ',');
    } else {
      $('.p_3').text(h.tipoDeVia + ' ' + h.calle + ',');
    }
  }

  // monta la url y pasa del marker al anuncio
  runAdCard(home: Home, flag: string) {
    if (home) {
      this.homeService.addHomeToLocalCache(home);
      this.routerLinkId = +home.id;
      this.routerLinkModel = home.model;
      var slugFest = home.tipo + '-' + home.calle + '-' + home.distrito + '-' + home.ciudad;
      this.routerLinkQueryParams = slug(slugFest, '-');
      if (flag == 'home') {
        setTimeout(() => {
          $('#linkPopup').trigger('click');
        }, 100);
      } else if (flag == 'ad' || flag == 'list' || flag == 'homeList') {
        setTimeout(() => {
          this.clickButton('linkPopup');
        }, 100);
      }
    }
  }

  call: number = 0;
  @ngLock()
  fireMapEvents(e: MouseEvent) {
    this.boxedPoints = this.map.getBounds().toBBoxString().split(',');
    if (this.boxedPoints) {
      if (this.searchOption != 'Vivienda') {
        this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',model@=*Other' + ',&sorts=');
      } else {
        this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',&sorts=')
      }
    } else {
      this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
    }
    if (this.call < 1) {
      setTimeout(() => {
        this.clickButton('leafletEvent');
      }, 900);
    }
    this.call++;
    setTimeout(() => {
      ngUnlock(this.fireMapEvents);
    }, 800);
  }

  /************************************************************/
  ngOnInit(): void {
    initFlowbite();
    this.map = L.map('map', {
      renderer: L.canvas(),
      wheelPxPerZoomLevel: 100,
      zoomSnap: 0.2,
      wheelDebounceTime: 100,
    }).setView(
      [39.46975, -0.37739],
      16  // 25
    ).on('zoomend', () => {
      if (!this.disableMapEvents) {
        this.clickButton('leafletEvent');
        //console.log(this.map.getZoom())
      }
      this.boxedPoints = this.map.getBounds().toBBoxString().split(',');
    }).on('moveend', () => {
      if (!this.disableMapEvents) {
        this.clickButton('leafletEvent');
      }
      this.boxedPoints = this.map.getBounds().toBBoxString().split(',');
    });
    if (this.state) {
      this.user = this.authenticationService.getUserFromLocalCache();
    }
    this.getLocation();
    this.loadScripts();
    for (let i = 0; i < cssPathHome.length; i++) {
      this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
      this.renderer2.appendChild(this.document.head, this.styleUser[i]);
      this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
      this.renderer2.setProperty(this.styleUser[i], 'href', cssPathHome[i]);
    }
    this.map.zoomControl.setPosition('bottomleft');
    this.clearMap('full-clear');
    this.primeng.ripple.set(true);
    if (this.state) {
      this.setCardLike();
    }
    setTimeout(() => { ngUnlock(this.cuoreLikeFeature); }, 2000);
  }

  //@ViewChildren('redheartcheckbox') likes4ever: QueryList<ElementRef>
  setCardLike() {
    setTimeout(() => {
      if (this.state) {
        if (this.homes) {
          this.homes.forEach(hm => {
            if (hm.likeMeForever) {
              hm.likeMeForever.forEach(lk => {
                if (lk == this.user.userId) {
                  //const doc = document.getElementById(hm.viviendaId) as HTMLInputElement;
                  //doc.checked = true;
                  $('#' + hm.viviendaId).prop("checked", true);
                }
              })
            }
          })
        }
      }
    }, 500);
  }

  getLocation() {
    if (!this.userLocationCoords) {
      this.map.locate({ setView: true, maxZoom: 16 }); // llamada para que la geolocalización funcione
      this.map.on('locationfound', (e: { accuracy: number; latlng: LatLng }) => {
        this.userLocationCoords = e.latlng; //Object.assign({}, e.latlng);
        this.map.setView(this.userLocationCoords, 16); // pon el foco en el mapa
        this.map.fitBounds([[this.userLocationCoords.lat, this.userLocationCoords.lng]]); // por si acaso..
        this.boxedPoints = this.map.getBounds().toBBoxString().split(',');
        if (this.boxedPoints) {
          if (this.searchOption != 'Vivienda') {
            this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',model@=*Other' + ',&sorts=');
          } else {
            this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',&sorts=')
          }
        } else {
          this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
        }
      });
      this.map.on('locationerror', () => {
        this.userLocationCoords = new L.latLng(40.4165000, -3.7025600);
        this.map.setView(this.userLocationCoords, 10); // pon el foco en el mapa
        this.map.fitBounds([[this.userLocationCoords.lat, this.userLocationCoords.lng]]);
        this.boxedPoints = this.map.getBounds().toBBoxString().split(',');
        if (this.boxedPoints) {
          if (this.searchOption != 'Vivienda') {
            this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',model@=*Other' + ',&sorts=');
          } else {
            this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',&sorts=')
          }
        } else {
          this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
        }
      }); // si el usuario no activa la geolocalización
    }
  }
  // only 4debug
  printSelect(e: any) {
    /*if (this.homeDto.vistasDespejadas) {
      for (let index = 0; index < e.length; index++) {
        console.log(e[index])
      }
    }*/
    console.log('string: ' + e)
  }

  openModalNewProperty() {
    switch (this.homeDto.prototipo) {
      case 'Vivienda':
        $(".modal").toggleClass("is-active");
        break;
      case 'Oficina':
        this.showDialog('new-other-modal');
        break;
      default:
        break;
    }
  }

  disableMapEvents: boolean = false;
  createLocationMarker() {
    this.disableMapEvents = true;
    this.map.closePopup();
    this.home = new Home();
    this.homeDto = new HomeDto();
    this.images = new Array<HomeImage>();// new Array(30).fill('');
    this.tempEnergy = null;
    this.lg.clearLayers();
    //this.map.flyTo([this.userLocationCoords],25,{ animate:true,duration:1.5 });
    console.log(this.userLocationCoords);
    this.waypointsFrom = this.userLocationCoords;
    /*this.notificationService.notify(
      NotificationType.INFO,
      'Mueve el marcador hasta su propiedad'
    );*/
    this.toastr.success(
      'Arrastra el marcador!',
      'Mueve el marcador hasta su ubicación!'
    );
    this.markerPoint = new L.marker(this.map.getCenter(), {
      draggable: true,
      icon: luxuryRed,
    }).bindPopup(`
      
      <!--<button type="button" class="button is-primary is-rounded"  >Hecho</button>-->
      <div class="buttons has-addons is-centered " style="left:-0.18em;top:0;botton:0;position:absolute; ">
        <button class="button is-success" onclick="runModal()">Guardar</button>
        <button class="button is-success is-light" onclick="closeSmallPopup()">Cancelar</button>
      </div>
          
      `, {
      maxWidth: 382,
      maxHeight: 152,
      /*removable: true,
      editable: true,*/
      /*direction: 'top',*/
      permanent: false,
      /*sticky: false,*/
      offset: [6, -64],
      opacity: 0,
      className: 'tooltipX',
    });
    this.lg = new L.LayerGroup([this.markerPoint]);
    this.lg.addTo(this.map);
    this.markerPoint.on('move', () => (this.waypointsFrom = this.markerPoint.getLatLng()));
    this.markerPoint.on('moveend', () => console.log(this.waypointsFrom));
    this.markerPoint.on('dragend', () => this.markerPoint.openPopup());
    this.map.flyTo(this.map.getCenter(), 18);
  }

  conditionTabs() {
    if (this.homeDto.tipo == 'Habitación' || this.homeDto.condicion == 'Compartir') {
      this.shareTab.next(false);
      this.saleTab.next(true);
      this.rentTab.next(false);
      var x = document.getElementById('kompartirTitle');
      x.style.textDecoration = 'none';
      var y = document.getElementById('alquilerTitle');
      y.style.textDecoration = 'none';
      this.homeDto.precioFinal = null;
      this.homeDto.condicion = 'Compartir';
    } else if (this.homeDto.condicion == 'Venta') {
      this.rentTab.next(true);
      this.shareTab.next(true);
      this.saleTab.next(false);
      var x = document.getElementById('alquilerTitle');
      x.style.textDecoration = 'line-through';
      var y = document.getElementById('kompartirTitle');
      y.style.textDecoration = 'line-through';
      this.homeDto.precioAlquiler = null;
    } else if (this.homeDto.condicion == 'Alquiler y venta') {
      this.shareTab.next(true);
      this.rentTab.next(false);
      this.saleTab.next(false);
      var y = document.getElementById('kompartirTitle');
      y.style.textDecoration = 'line-through';
      var x = document.getElementById('alquilerTitle');
      x.style.textDecoration = 'none';
    } else if (this.homeDto.condicion == 'Alquiler') {
      var y = document.getElementById('kompartirTitle');
      y.style.textDecoration = 'line-through';
      var x = document.getElementById('alquilerTitle');
      x.style.textDecoration = 'none';
      this.saleTab.next(true);
      this.shareTab.next(true);
      this.homeDto.precioFinal = null;
      this.rentTab.next(false);
    } else {
      this.shareTab.next(undefined);
      this.saleTab.next(true);
      this.rentTab.next(false);
      this.homeDto.precioFinal = null;
    }
    if (this.homeDto.tipo != 'Habitación') {
      if (this.homeDto.condicion == 'Alquiler') {
        this.saleTab.next(true);
        this.homeDto.precioFinal = null;
      } else if (this.homeDto.condicion == 'Venta' || this.homeDto.condicion == 'Alquiler y venta') {
        this.saleTab.next(false);
      }
    }
  }

  getShareTab(): boolean {
    return this.shareTab.getValue();
  }
  getRentTab(): boolean {
    return this.rentTab.getValue();
  }

  clearPricesRentOrSale(){
    this.homeDto.precioFinal=null;
    this.homeDto.precioAlquiler=null;
  }

  tabIndex: number = 0;
  increaseTab() {
    if (this.tabIndex == 0) {
      this.whatTab('Acabados');
    } else if ((this.homeDto.condicion == null || this.homeDto.condicion == undefined) && this.tabIndex == 1) {
      this.whatTab('Alquiler');
      console.log(this.tabIndex);
    } else if ((this.homeDto.condicion == null || this.homeDto.condicion == undefined) && this.tabIndex == 2) {
      this.whatTab('Compartir');
      console.log(this.tabIndex);
    } else if ((this.homeDto.condicion == null || this.homeDto.condicion == undefined) && this.tabIndex == 3) {
      if (this.adTitle.getValue() == 'Proyecto nuevo') {
        this.whatTab('Publicar');
      } else {
        this.whatTab('Movilidad');
      }
    } else if ((this.homeDto.condicion == null || this.homeDto.condicion == undefined) && this.tabIndex == 4) {
      this.whatTab('Multimedia');
    } else if ((this.homeDto.condicion == null || this.homeDto.condicion == undefined) && this.tabIndex == 5) {
      this.whatTab('Publicar');
    } else if ((this.homeDto.condicion == 'Alquiler' || this.homeDto.condicion == 'Alquiler y venta') && this.tabIndex === 1) {
      this.whatTab('Alquiler');
    } else if ((this.homeDto.condicion == 'Alquiler' || this.homeDto.condicion == 'Alquiler y venta') && this.tabIndex === 2) {
      this.whatTab('Movilidad');
    } else if ((this.homeDto.condicion == 'Alquiler' || this.homeDto.condicion == 'Alquiler y venta') && this.tabIndex === 4) {
      this.whatTab('Multimedia');
    } else if (this.homeDto.condicion != 'Compartir' && this.tabIndex === 2) {
      this.whatTab('Compartir');
    } else if (this.homeDto.condicion === 'Compartir' && this.tabIndex === 3) {
      this.whatTab('Movilidad');
    } else if (this.homeDto.condicion === 'Venta' && this.tabIndex === 0) {
      this.whatTab('Acabados');
    } else if (this.homeDto.condicion === 'Venta' && this.tabIndex === 1) {
      this.whatTab('Movilidad');
    } else if (this.homeDto.condicion === 'Compartir' && this.tabIndex === 1) {
      this.whatTab('Alquiler');
    } else if (this.homeDto.condicion === 'Compartir' && this.tabIndex === 2) {
      this.whatTab('Compartir');
    } else if (this.homeDto.condicion === 'Compartir' && this.tabIndex === 3) {
      this.whatTab('Movilidad');
    } else if (this.homeDto.condicion === 'Compartir' && this.tabIndex === 4) {
      this.whatTab('Multimedia');
    } else {
      this.whatTab('Publicar');
    }
  }
  decreaseTab() {
    if (this.tabIndex >= 1) {
      if (this.homeDto.condicion == 'Venta' && this.tabIndex == 4) {
        this.tabIndex = 1;
      } else if ((this.homeDto.condicion == 'Alquiler' || this.homeDto.condicion == 'Alquiler y venta') && this.tabIndex == 4) {
        this.tabIndex = 2;
      } else {
        this.tabIndex--;
      }
      if (this.tabIndex == 5 && this.adTitle.getValue() == 'Proyecto nuevo') {
        this.tabIndex = 3;
        console.log(this.tabIndex)
      }
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
    }
    if (this.tabIndex == 4) {
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
    }
    if (this.tabIndex == 0) {
      var x = document.getElementById('prevTab');
      x.style.display = 'none';
    }
  }
  whatTab(flag: string) {
    if (flag == 'General') {
      this.tabIndex = 0;
      var x = document.getElementById('prevTab');
      x.style.display = 'none';
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
    } else if (flag == 'Acabados') {
      this.tabIndex = 1;
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
      x.style.display = 'block';
    } else if (flag == 'Alquiler') {
      this.tabIndex = 2;
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    } else if (flag == 'Compartir') {
      this.tabIndex = 3;
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    } else if (flag == 'Movilidad') {
      if (this.adTitle.getValue() == 'Nueva propiedad') {
        this.tabIndex = 4;
      } else if (this.adTitle.getValue() == 'Proyecto nuevo') {
        this.tabIndex = 2;
      }
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    } else if (flag == 'Multimedia') {
      if (this.adTitle.getValue() == 'Proyecto nuevo') {
        this.tabIndex = 3;
        var x = document.getElementById('nextTab');
        x.style.display = 'block';
        var x = document.getElementById('prevTab');
        x.style.display = 'block';
      } else {
        this.tabIndex = 5;
        var x = document.getElementById('nextTab');
        x.style.display = 'block';
        var x = document.getElementById('prevTab');
        x.style.display = 'block';
      }
    } else if (flag == 'Publicar') {
      this.tabIndex = 6;
      var x = document.getElementById('nextTab');
      x.style.display = 'none';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    }
  }

  public isHighEficiency(): string {
    if (this.homeDto.emisiones && this.homeDto.consumo) {
      if (this.homeDto.emisiones.charAt(0) == 'A' && this.homeDto.consumo.charAt(0) == 'A') {
        return 'true'
      } else {
        return 'false';
      }
    }
    return 'false';
  }

  rotateArrows(e: any, id: string) {
    if (e)
      $("." + id).find(".ant-select-arrow").toggleClass("ant-select-arrow-down");
    else
      $("." + id).find(".ant-select-arrow").removeClass("ant-select-arrow-down");
  }

  // Dropzone
  selectedFiles?: FileList;
  filesUploadSuccessfully: number = 0;
  fileProgress: number[] = []
  dropzone: any;
  public config: DropzoneConfigInterface = {
    clickable: true,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    maxFilesize: 32,
    addRemoveLinks: true,
    autoProcessQueue: true
  };
  @ViewChild(DropzoneComponent) protected dropComponent: DropzoneComponent;
  public onUploadError(args: any): void {
    if (args[1] == 'You can not upload any more files.') {
      this.toastr.error(
        'Máximo 60 imágenes !',
        'Límite excedido'
      );
      this.dropzone.removeFile(args[0]);
    } else if (args[1].substring(0, 15) == 'File is too big') {
      this.toastr.error(
        'Tamaño máximo 32mb !',
        'Límite excedido'
      );
      this.dropzone.removeFile(args[0]);
    } else if (args[1] == "You can't upload files of this type.") {
      this.toastr.error(
        'Solo imágenes !',
        'Aquí no puedes subir archivos de ese tipo.'
      );
    } else {
      this.toastr.error(
        args[1]
      );
      console.log(args)
    }
    //console.log(args);
  }

  public onUploadSuccess(args: any): void {
    console.log('onUploadSuccess:', args);
    $(".dz-image").children("img").addClass("h-100");
    $(document).ready(function () {
      $('[class="dz-remove"]').each(function (index, v) {
        var text = $(v).text();
        var new_text = text.replace("Remove file", "Borrar");
        $(v).text(new_text);
      });
    });
  }

  public onRemove(e: any) {
    console.log(e);
  }

  public dropzoneInit(e: any) {
    console.log('Dropzone ready !!')
  }

  // energy form new home
  imageChangedEventEnergy: any = null;
  croppedImageEnergy: any = null;
  tempEnergy: File = null;
  tempEnergyTagName: string;
  // energy new office
  imageChangedEventEnergyOffice: any = null;
  croppedImageEnergyOffice: any = null;
  tempEnergyOffice: File = null;
  tempEnergyTagNameOffice: string;
  // energy edit form user-pro
  imageChangedEventEnergyUpdate: any = null;
  croppedImageEnergyUpdate: any = null;
  tempEnergyUpdate: File = null;
  tempEnergyTagNameUpdate: string;
  // branding
  imageChangedEventBranding: any = null;
  imageChangedEventProfile: any = null;
  croppedImageBranding: any = null;
  // profile
  croppedImageProfile: any = null;
  tempBranding: File = null;
  tempProfile: File = null;
  fileChangeEvent(event: any, option: string): void {
    if (option === 'branding') {
      this.imageChangedEventBranding = event;
    } else if (option === 'profile') {
      this.imageChangedEventProfile = event;
    } else if (option === 'energy') {
      this.imageChangedEventEnergy = event;
      if (event.target.files[0].name) {
        this.tempEnergyTagName = event.target.files[0].name
      }
    } else if (option === 'energyUpdate') {
      this.imageChangedEventEnergyUpdate = event;
      if (event.target.files[0].name) {
        this.tempEnergyTagNameUpdate = event.target.files[0].name
      }
    } else if (option === 'energyOffice') {
      this.imageChangedEventEnergyOffice = event;
      if (event.target.files[0].name) {
        this.tempEnergyTagNameOffice = event.target.files[0].name
      }
    }
  }

  imageCropped(event: ImageCroppedEvent, option: string) {
    var randomString = (Math.random() + 1).toString(36).substring(7);
    if (option === 'branding') {
      this.croppedImageBranding = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.tempBranding = new File([event.blob], randomString + '.jpg');
    } else if (option === 'profile') {
      this.croppedImageProfile = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.tempProfile = new File([event.blob], randomString + '.jpg');
    } else if (option === 'energy') {
      this.croppedImageEnergy = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.tempEnergy = new File([event.blob], randomString + '.jpg');
    } else if (option === 'energyUpdate') {
      this.croppedImageEnergyUpdate = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.tempEnergyUpdate = new File([event.blob], randomString + '.jpg');
    } else if (option === 'energyOffice') {
      this.croppedImageEnergyOffice = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.tempEnergyOffice = new File([event.blob], randomString + '.jpg');
    }
  }

  @ViewChild('editUserForm') updateUserForm: NgForm; // edit user pro
  @ViewChild('updateHomeForm') updateHomeForm: NgForm; // edit home pro
  @ViewChild('newOtherForm') newOtherForm: NgForm;
  imageLoaded(image: LoadedImage, option: string) {
    if (option == 'branding') {
      this.updateUserForm.control.markAsDirty();
    } else if (option == 'profile') {
      this.updateUserForm.control.markAsDirty();
    } else if (option == 'energy') {
      this.newMarkerForm.control.markAsDirty();
    } else if (option == 'energyUpdate') {
      this.updateHomeForm.control.markAsDirty();
    } else if (option == 'energyOffice') {
      this.newOtherForm.control.markAsDirty();
    }
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
    this.notificationService.notify(NotificationType.ERROR, `Algo salio mal. Por favor intentelo pasados unos minutos.`);
  }

  clearEnergySelection(option: string) {
    if (option == 'energy') {
      this.tempEnergy = null;
      this.imageChangedEventEnergy = null;
      this.tempEnergyTagName = '';
    } else if (option == 'energyUpdate') {
      this.tempEnergyUpdate = null;
      this.imageChangedEventEnergyUpdate = null;
      this.tempEnergyTagNameUpdate = '';
    } else if (option == 'energyOffice') {
      this.tempEnergyOffice = null;
      this.imageChangedEventEnergyOffice = null;
      this.tempEnergyTagNameOffice = '';
    }
  }

  newHome() {
    this.lg.remove(this.markerPoint);
    if (this.adTitle.getValue() == 'Proyecto nuevo') {
      this.homeDto.tipo = 'Proyecto nuevo';
      this.homeDto.condicion = 'Venta';
      this.homeDto.estado = 'Obra nueva';
      this.homeDto.direccionAproximada = 'true';
    } else if (this.adTitle.getValue() == 'Oficina') {
      this.homeDto.tipo = 'Oficina';
    } else if (this.adTitle.getValue() == 'Local o nave') {
      this.homeDto.tipo = 'Negocio';
    } else if (this.adTitle.getValue() == 'Parcela') {
      this.homeDto.tipo = 'Suelo';
    } else if (this.adTitle.getValue() == 'Garage') {
      this.homeDto.tipo = 'Garage';
    } else if (this.adTitle.getValue() == 'Trastero') {
      this.homeDto.tipo = 'Trastero';
    }
    this.showLoading = true;
    const formData = new FormData();
    formData.append('lat', this.waypointsFrom.lat);
    formData.append('lng', this.waypointsFrom.lng);
    formData.append('ciudad', this.homeDto.ciudad);
    formData.append('calle', this.homeDto.calle);
    formData.append('numero', this.homeDto.numero);
    formData.append('cp', this.homeDto.cp);
    formData.append('superficie', this.homeDto.superficie);
    formData.append('condicion', this.homeDto.condicion);
    formData.append('tipo', this.homeDto.tipo);
    formData.append('orientacion', this.propertyGuidance(this.homeDto.orientacion));
    formData.append('distrito', this.homeDto.distrito);
    formData.append('tipoDeVia', this.homeDto.tipoDeVia);
    formData.append('habitaciones', this.homeDto.habitaciones);
    formData.append('aseos', this.homeDto.aseos);
    formData.append('estado', this.homeDto.estado);
    formData.append('destacar', this.homeDto.destacar);
    formData.append('colorDestacar', this.homeDto.colorDestacar);
    formData.append('aireAcondicionado', this.homeDto.aireAcondicionado);
    formData.append('ventilacionCruzada', this.homeDto.ventilacionCruzada);
    formData.append('aerotermia', this.homeDto.aerotermia);
    formData.append('dobleAcristalamiento', this.homeDto.dobleAcristalamiento);
    formData.append('panelesSolares', this.homeDto.panelesSolares);
    formData.append('gasNatural', this.homeDto.gasNatural);
    formData.append('calefaccion', this.homeDto.calefaccion);
    formData.append('emisiones', this.homeDto.emisiones);
    formData.append('consumo', this.homeDto.consumo);
    formData.append('eficienciaEnergetica', this.isHighEficiency());
    formData.append('ascensor', this.homeDto.ascensor);
    formData.append('gym', this.homeDto.gym);
    formData.append('tenis', this.homeDto.tenis);
    formData.append('padel', this.homeDto.padel);
    formData.append('piscinaComp', this.homeDto.piscinaComp);
    formData.append('zonaDeOcio', this.homeDto.zonaDeOcio);
    formData.append('videoPortero', this.homeDto.videoPortero);
    formData.append('sauna', this.homeDto.sauna);
    formData.append('jacuzzi', this.homeDto.jacuzzi);
    formData.append('golf', this.homeDto.golf);
    formData.append('jardin', this.homeDto.jardin);
    formData.append('columpios', this.homeDto.columpios);
    formData.append('recepcion24_7', this.homeDto.recepcion24_7);
    formData.append('videoVigilancia', this.homeDto.videoVigilancia);
    formData.append('alarmaIncendios', this.homeDto.alarmaIncendios);
    formData.append('extintores', this.homeDto.extintores); // rociadores de incendio
    formData.append('generadorEmergencia', this.homeDto.generadorEmergencia);
    formData.append('instalacionesDiscapacitados', this.homeDto.instalacionesDiscapacitados);
    formData.append('terraza', this.homeDto.terraza);
    formData.append('amueblado', this.homeDto.amueblado);
    formData.append('parquet', this.homeDto.parquet);
    formData.append('trastero', this.homeDto.trastero);
    formData.append('armariosEmpotrados', this.homeDto.armariosEmpotrados);
    formData.append('piscinaPrivada', this.homeDto.piscinaPrivada);
    formData.append('balcon', this.homeDto.balcon);
    formData.append('descripcion', this.homeDto.descripcion);
    formData.append('nombreCreador', this.user.username);
    formData.append('idCreador', this.user.userId);
    formData.append('cabinaHidromasaje', this.homeDto.cabinaHidromasaje);
    formData.append('direccionAproximada', this.homeDto.direccionAproximada);
    formData.append('politicaPrivacidad', this.homeDto.politicaPrivacidad);
    //formData.append('destacado', this.homeDto.destacado); ahora tienen que pagar :)
    //rutas
    formData.append('colegios', JSON.stringify(this.colegio));
    formData.append('universidades', JSON.stringify(this.universidad));
    formData.append('supermercados', JSON.stringify(this.mercados));
    formData.append('metro', JSON.stringify(this.metro));
    formData.append('bus', JSON.stringify(this.autobus));
    formData.append('aeropuerto', JSON.stringify(this.aeropuerto));
    formData.append('distanciaAlMar', JSON.stringify(this.beach));
    formData.append('Model', this.defineModel(this.homeDto.tipo));
    formData.append('Prototipo', this.homeDto.prototipo);
    // detalles común Other
    if (this.homeDto.climatizacion) {
      formData.append('Climatizacion', this.homeDto.climatizacion);
      formData.append('aireAcondicionado', 'true');
    }
    formData.append('ConAlmacen', this.homeDto.conAlmacen);
    formData.append('LucesSalidaEmergencia', this.homeDto.lucesSalidaEmergencia);
    // detalles de oficina
    if (this.home.prototipo == 'Oficina') {
      formData.append('Aparcamientos', this.homeDto.aparcamientos);
      formData.append('Disposicion', this.homeDto.disposicion);
      formData.append('Distribucion', this.homeDto.distribucion);
      formData.append('ControlDeAccesoPersonal', this.homeDto.controlDeAccesoPersonal);
      formData.append('ControlDeAccesoVehiculos', this.homeDto.controlDeAccesoVehiculos);
      formData.append('FalsoTecho', this.homeDto.falsoTecho);
      formData.append('SueloTecnico', this.homeDto.sueloTecnico);
      formData.append('Uso', this.homeDto.uso);
    } else if (this.home.prototipo == 'Negocio') {
      // Negocio
      formData.append('Nave', this.homeDto.nave);
      formData.append('Local', this.homeDto.local);
      formData.append('ActividadComercial', this.homeDto.actividadComercial);
      formData.append('HaceEsquina', this.homeDto.haceEsquina);
      formData.append('SalidaDeHumos', this.homeDto.salidaDeHumos);
      formData.append('Traspaso', this.homeDto.traspaso);
      formData.append('ConOficina', this.homeDto.conOficina);
      formData.append('Escaparates', this.homeDto.escaparates);
    } else if (this.home.prototipo == 'Suelo') {
      formData.append('Urbano', this.homeDto.urbano);
      formData.append('Urbanizable', this.homeDto.urbanizable);
      formData.append('NoUrbanizable', this.homeDto.noUrbanizable);
    } else if (this.home.prototipo == 'Garage') {
      formData.append('plazaParaCoche', this.homeDto.plazaParaCoche);
      formData.append('plazaParaMoto', this.homeDto.plazaParaMoto);
    } else if (this.home.prototipo == 'Edificio') {
      formData.append('EdificioExclusivoOficinas', this.homeDto.edificioExclusivoOficinas);
    }

    // te guardan un array en un string
    if (this.homeDto.vistasDespejadas) {
      formData.append('vistasDespejadas', JSON.stringify(this.homeDto.vistasDespejadas).split('[').join('').split(']').join('').split('"').join('').split("'").join(''));
    }
    if (this.homeDto.antiguedad) {
      formData.append('antiguedad', this.homeDto.antiguedad.toString().substring(11, 15));
    }
    if (!this.homeDto.bajoOplantabaja) {
      if (this.homeDto.piso && this.homeDto.plantaMasAlta) {
        formData.append('piso', this.homeDto.piso + "/" + this.homeDto.plantaMasAlta);
      }
    } else if (this.homeDto.bajoOplantabaja) {
      formData.append('bajoOplantabaja', this.homeDto.bajoOplantabaja);
    }
    if (this.homeDto.garage) {
      if (this.homeDto.garage == '5+') {
        formData.append('garage', '6');
      } else {
        formData.append('garage', this.homeDto.garage);
      }
    }
    if (this.homeDto.aseoEnsuite) {
      if (this.homeDto.aseoEnsuite == '5+') {
        formData.append('aseoEnsuite', '6');
      } else {
        formData.append('aseoEnsuite', this.homeDto.aseoEnsuite);
      }
    }
    if (this.homeDto.precioFinal) {
      formData.append('precioFinal', this.homeDto.precioFinal);
    }
    //detalles de alquiler
    if (this.homeDto.precioAlquiler != null && (this.homeDto.condicion == 'Alquiler' || this.homeDto.condicion == 'Alquiler y venta' || this.homeDto.condicion == 'Compartir')) {
      formData.append('precioAlquiler', this.homeDto.precioAlquiler);
      if (this.fechaDisponibleAlquiler) {
        formData.append('disponibilidad', this.fechaDisponibleAlquiler);
      }
      formData.append('mascotas', this.homeDto.mascotas);
      formData.append('fianza', this.homeDto.fianza);
      formData.append('estanciaMinima', this.homeDto.estanciaMinima);
    }
    //detalles adicionales para compartir
    if ((this.homeDto.precioAlquiler != null) && (this.homeDto.condicion == 'Compartir')) {
      formData.append('precioAlquiler', this.homeDto.precioAlquiler);
      formData.append('sepuedeFumar', this.homeDto.sepuedeFumar);
      formData.append('seadmitenParejas', this.homeDto.seadmitenParejas);
      formData.append('seadmitenMenoresdeedad', this.homeDto.seadmitenMenoresdeedad);
      formData.append('seadmitenMochileros', this.homeDto.seadmitenMochileros);
      formData.append('seadmitenJubilados', this.homeDto.seadmitenJubilados);
      formData.append('seadmiteLGTBI', this.homeDto.seadmiteLGTBI);
      formData.append('propietarioviveEnlacasa', this.homeDto.propietarioviveEnlacasa);
      if (this.homeDto.perfilCompartir) {
        formData.append('perfilCompartir', this.homeDto.perfilCompartir);
      }
      if (this.homeDto.habitantesActualmente) {
        formData.append('habitantesActualmente', this.homeDto.habitantesActualmente);
      }
      if (this.homeDto.ambiente) {
        formData.append('ambiente', this.homeDto.ambiente);
      }
      if (this.homeDto.gastos) {
        formData.append('gastos', this.homeDto.gastos);
      }
    }
    // detalles para proyectos nuevos
    if (this.adTitle.getValue() == 'Proyecto nuevo') {
      formData.append('nombreProyecto', this.homeDto.nombreProyecto);
      formData.append('porcentajeVendido', this.homeDto.porcentajeVendido);
      formData.append('habitacionesDesde', this.homeDto.habitacionesDesde);
      formData.append('habitacionesHasta', this.homeDto.habitacionesHasta);
      formData.append('superficieDesde', this.homeDto.superficieDesde);
      formData.append('superficieHasta', this.homeDto.superficieHasta);
      formData.append('precioDesde', this.homeDto.precioFinal);
      formData.append('alturas', this.homeDto.alturas);
      formData.append('totalViviendasConstruidas', this.homeDto.totalViviendasConstruidas);
      formData.append('estadoConstruccion', this.homeDto.estadoConstruccion);
      if (this.homeDto.estadoConstruccion == 'Terminado') {
        formData.append('antiguedad', this.homeDto.antiguedad.toString().substring(11, 15));
      } else if (this.homeDto.estadoConstruccion == 'EnCurso') {
        formData.append('antiguedad', '0');
        if (this.homeDto.porcentajeTerminado) {
          formData.append('porcentajeTerminado', this.homeDto.porcentajeTerminado);
        }
        if (this.homeDto.finDeObra) {
          formData.append('finDeObra', this.homeDto.finDeObra.toString().substring(11, 15));
        }
      }
      if (this.homeDto.tipos) {
        formData.append('tipos', JSON.stringify(this.homeDto.tipos).split('[').join('').split(']').join('').split('"').join('').split("'").join(''));
      }
    }
    // branding at home to popup
    if (this.user.isPro) {
      if (this.user.color) {
        formData.append('proColor', this.user.color);
      }
      if (this.user.brandImage) {
        formData.append('proImageAsString', JSON.stringify(this.user.brandImage));
      }
    }
    // energy cert
    if (this.tempEnergy != null) {
      const body = new FormData();
      body.append('image', this.tempEnergy);
      this.subscriptions.push(this.imageService.uploadSignature(body, this.tempEnergy.name)
        .subscribe({
          next: (res: any) => {
            var energyCert: HomeImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            console.log(res);
            this.homeDto.energyCertAsString = JSON.stringify(energyCert);
            formData.append('energyCertAsString', this.homeDto.energyCertAsString);
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, `Certificado energético: algo salio mal. Por favor intentelo pasados unos minutos.` + err);
          }
        }));
    }
    // video
    if (this.homeDto.video) {
      var splitLink = this.homeDto.video.split('watch?v=')
      var embedLink1 = splitLink.join("embed/")
      formData.append('video', embedLink1 + '?showinfo=0&enablejsapi=1&origin=http://localhost:4200');
    }
    // fotos
    this.selectedFiles = this.dropComponent.directiveRef.dropzone().files;
    this.fileStatus.total = this.selectedFiles.length;
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i]) {
          const body = new FormData();
          body.append('image', this.selectedFiles[i]);
          this.subscriptions.push(Axios.post(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${this.selectedFiles[i].name}`, body, {
            // onUploadProgress: progressEvent => { }
          }).subscribe({
            next: (res: any) => {
              console.log(res);
              this.images[i] = {
                imageId: res.data.data.id,
                imageName: res.data.data.title,
                imageUrl: res.data.data.url,
                imageDeleteUrl: res.data.data.delete_url
              };
              this.filesUploadSuccessfully = i;
              console.log('subidas ' + this.filesUploadSuccessfully + ' de ' + this.selectedFiles.length);
              if ((this.selectedFiles.length - 1) == this.filesUploadSuccessfully) {
                setTimeout(() => {
                  formData.append('imagesAsString', JSON.stringify(this.images));
                  var obj = {};
                  formData.forEach((value, key) => obj[key] = value);
                  for (let key in obj) {
                    if (obj[key] === "undefined") {
                      delete obj[key];
                    } else if (obj[key] === null) {
                      delete obj[key];
                    }
                  }
                  var json = JSON.stringify(obj);
                  console.log(json);
                  this.subscriptions.push(
                    this.homeService.addHome(json).subscribe({
                      next: () => {
                        this.router.navigate(['/home']),
                          this.showLoading = false;
                        this.notificationService.notify(NotificationType.SUCCESS, `Anuncio creado.`);
                        this.dropComponent.directiveRef.reset();
                        var resetForm = <HTMLFormElement>document.getElementById('newMarkerForm');
                        resetForm?.reset();
                        $(".modal").removeClass("is-active");
                      },
                      error: (err: any) => {
                        this.notificationService.notify(NotificationType.ERROR, err);
                        this.showLoading = false;
                      }
                    })
                  );
                }, 3000);
              }
            },
            error: (err: any) => {
              const msg = 'Error al procesar la imagen: ' + this.selectedFiles[i].name + ' error: ' + err;
              this.notificationService.notify(NotificationType.ERROR, msg);
              this.showLoading = false;
            }
          }));
        }
      }
    }
    this.map.removeLayer(this.lg);
    this.disableMapEvents = false;
    /*setTimeout(()=>{
      this.ngOnInit();
      window.location.reload();
    },1000);*/
  }

  // 4debug
  printDate() {
    var onBuy = new Date();
    console.log(onBuy.toISOString())
    console.log(onBuy.toLocaleString())
    console.log(onBuy.toUTCString())
    console.log(onBuy.getDay())
    console.log(onBuy.getDate())
    console.log(onBuy.getUTCDate())
    console.log(format(new Date(), "yyyy-MM-dd"))
    var date = new Date("yyyy-MM-dd")
    console.log(date)
    //console.log(this.user.config.maxFiles)
    /*console.log(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"))
    var onBuy = new Date();
    var onAfter = addDays(onBuy, 10);
    console.log(onAfter)
    console.log(isBefore(new Date(), onAfter))*/
  }

  checkBox(param): any {
    console.log(param)
    //console.log(this.homeDto.porcentajeVendido)
    /*const f = new FormData();
    var a: any = false;
    f.append('abc', a);
    f.append('def', this.homeDto.habitaciones);
    console.log(f.get('abc'))
    console.log(f.get('def'))*/
  }
  /* 
  * Filters
  *
  * 
  * 
  * 
  */
  myMap: any;
  public filter(value: any, flag: string) {
    // mapa para hacer la peticion
    this.myMap = new Map<string, string>(JSON.parse(localStorage.getItem("detailFiltersMap")));
    localStorage.removeItem('detailFiltersMap');
    // variable para mostrar los select de alquiler/compartir o venta
    // el jquery resetea el multiselect
    if (flag == 'condicion') {
      this.filterRentSalePriceFlag = value;
      this.mapRentSalePriceFlag = value;
      $(".ant-select-clear").trigger('click');
    }
    /*
    * responde a los eventos de los multiselect: vistas y estado
    */
    if (this.myMap.has(flag) && (flag != 'tipo' && flag != 'vistasDespejadas' && flag != 'estado') && value != null) { // contiene el elemento
      this.myMap.delete(flag);
      this.clearPrices(flag);
      this.myMap.set(flag, value);
      this.searchFilterItems(this.myMap);
    } else if (!this.myMap.has(flag) && (flag != 'tipo' && flag != 'vistasDespejadas' && flag != 'estado') && value != null) { // no contiene el elemento
      this.clearPrices(flag);
      this.myMap.set(flag, value);
      this.searchFilterItems(this.myMap);
    } else if (flag == 'tipo' && value != null) { // tipo
      if (this.myMap.has(flag)) {
        this.myMap.delete(flag);
      }
      var homeTypes = JSON.stringify(value);
      this.myMap.set(flag, homeTypes);
      this.searchFilterItems(this.myMap);
    } else if (flag == 'vistasDespejadas' && value != null) {
      if (this.myMap.has(flag)) {
        this.myMap.delete(flag);
      }
      var homeViews = JSON.stringify(value);
      this.myMap.set(flag, homeViews);
      this.searchFilterItems(this.myMap);
    } else if (flag == 'estado' && value != null) {
      if (this.myMap.has(flag)) {
        this.myMap.delete(flag);
      }
      var homeState = JSON.stringify(value);
      this.myMap.set(flag, homeState);
      this.searchFilterItems(this.myMap);
    }
  }

  /*
   * Si el usuario cambia de precio de alquiler a precio de venta o viceversa
   * esta función borra los 2 parámetros de filtrado anteriores
   */
  public clearPrices(flag: string) {
    if (flag == 'precioAlquilerMin' || flag == 'precioAlquilerMax') {
      if (this.myMap.has('precioVentaMin')) {
        this.myMap.delete('precioVentaMin');
      }
      if (this.myMap.has('precioVentaMax')) {
        this.myMap.delete('precioVentaMax');
      }
    }
    if (flag == 'precioVentaMin' || flag == 'precioVentaMax') {
      if (this.myMap.has('precioAlquilerMin')) {
        this.myMap.delete('precioAlquilerMin');
      }
      if (this.myMap.has('precioAlquilerMax')) {
        this.myMap.delete('precioAlquilerMax');
      }
    }
  }
  /* 
  * itera el mapa, crea un string con la url y hace la petición
  */
  labelMultiselect: string = 'Todas';
  public searchFilterItems(map: Map<string, string>) {
    var urlFilterRequest = '&sorts=';
    map.forEach((value: string, key: string) => {
      if (key == 'precioAlquilerMin' || key == 'precioAlquilerMax' || key == 'precioVentaMin' || key == 'precioVentaMax'
        || key == 'superficieMin' || key == 'superficieMax') {
        if (urlFilterRequest.includes('&sorts=')) {
          if (key == 'precioAlquilerMin') {
            if (value == 'Cualquiera') {
              var formatParam = '0';
            } else {
              var formatParam = value.replace('€', '').split(',').join(''); // me dejas un número entero
            }
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioAlquiler>=' + formatParam + ',') // lo pone sequido a sorts
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioAlquiler>=' + formatParam + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'precioAlquilerMax') {
            if (value == 'Cualquiera') {
              var formatParam = '600000000';
            } else {
              var formatParam = value.replace('€', '').split(',').join(''); // me dejas un número entero
            }
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioAlquiler<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioAlquiler<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'precioVentaMin') {
            if (value == 'Cualquiera') {
              var formatParam = '0';
            } else {
              var formatParam = value.replace('€', '').split(',').join(''); // me dejas un número entero
            }
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioFinal>=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioFinal>=' + formatParam + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'precioVentaMax') {
            if (value == 'Cualquiera') {
              var formatParam = '600000000';
            } else {
              var formatParam = value.replace('€', '').split(',').join(''); // me dejas un número entero
            }
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioFinal<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioFinal<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'superficieMin') {
            if (value == 'Cualquiera') {
              var formatParam = '0';
            } else {
              var formatParam = value.replace('m²', '').split(',').join('');
            }
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'superficie>=' + formatParam + ',')
            urlFilterRequest = formatUrl; // ordenamiento 
            urlFilterRequest = 'superficie>=' + formatParam + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'superficieMax') {
            if (value == 'Cualquiera') {
              var formatParam = '900000000';
            } else {
              var formatParam = value.replace('m²', '').split(',').join('');
            }
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'superficie<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'superficie<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          }
        }
        // responde a los radiobutton
      } else if (key == 'habitaciones' || key == 'aseos' || key == 'aseoEnsuite' || key == 'garage') {
        if (value != String(5)) {
          urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;

        } else {
          urlFilterRequest = key + '>=' + value + ',' + urlFilterRequest;
        }
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
        // switches comodidades true/false
      } else if (String(value) == 'true') {
        urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
        // procesa los multiselect
      } else if (key == 'tipo') {
        var obj = JSON.parse(value);
        var tipoValues = '';
        var modelValues: string[] = [];
        var modelOptions = '';
        for (var i = 0; i < obj.length; i++) {
          tipoValues += obj[i] + '|';
          modelValues.push(this.defineModel(obj[i]));
        }
        modelValues = [...new Set(modelValues)];
        for (var i = 0; i < modelValues.length; i++) {
          modelOptions += modelValues[i] + '|';
        }
        if (tipoValues.slice(-1) == "|") {
          tipoValues = tipoValues.slice(0, -1);
        }
        if (modelOptions.slice(-1) == "|") {
          modelOptions = modelOptions.slice(0, -1);
        }
        if (urlFilterRequest.includes('model@=*Flat,')) {
          urlFilterRequest = urlFilterRequest.split('model@=*Flat,').join('');
        } else if (urlFilterRequest.includes('model@=*House,')) {
          urlFilterRequest = urlFilterRequest.split('model@=*House,').join('');
        } else if (urlFilterRequest.includes('model@=*Flat|House,')) {
          urlFilterRequest = urlFilterRequest.split('model@=*Flat|House,').join('');
        } else if (urlFilterRequest.includes('model@=*House|Flat,')) {
          urlFilterRequest = urlFilterRequest.split('model@=*House|Flat,').join('');
        }
        urlFilterRequest = 'model' + '@=*' + modelOptions + ',' + 'tipo' + '@=*' + tipoValues + ',' + urlFilterRequest
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'vistasDespejadas') {
        var array = JSON.parse(value);
        var vistas = '';
        for (let index = 0; index < array.length; index++) {
          vistas += array[index] + '|';
        }
        if (vistas.slice(-1) == "|") {
          vistas = vistas.slice(0, -1);
        }
        urlFilterRequest = key + '@=*' + vistas + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'estado') {
        var array = JSON.parse(value);
        var estado = '';
        for (let index = 0; index < array.length; index++) {
          estado += array[index] + '|';
        }
        if (estado.slice(-1) == "|") {
          estado = estado.slice(0, -1);
        }
        urlFilterRequest = key + '@=*' + estado + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'descripcion') {
        var formatParam = value.split(' ').join('|');
        if (formatParam.slice(-1) == "|") {
          formatParam = formatParam.slice(0, -1);
        }
        urlFilterRequest = 'descripcion' + '@=*' + formatParam + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'ciudad') { // descarte: ciudad
        if (value != 'Todas') {
          urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
          localStorage.setItem('detailFiltersMap', JSON.stringify([...map]))
        } // segmented
      } else if (key == 'condicion') {
        urlFilterRequest = key + '@=*' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'prototipo') {
        var model = this.defineModel(value);
        console.log(model)
        urlFilterRequest = key + '@=*' + value + ',model@=*' + model + ',' + urlFilterRequest;
      }
    });
    // limpieza multiselect
    if (urlFilterRequest.includes('model@=*,')) {
      urlFilterRequest = urlFilterRequest.split('model@=*,').join('');
    }
    if (urlFilterRequest.includes('estado@=*,')) {
      urlFilterRequest = urlFilterRequest.split('estado@=*,').join('');
    }
    if (urlFilterRequest.includes('tipo@=*,')) {
      urlFilterRequest = urlFilterRequest.split('tipo@=*,').join('');
    }
    if (urlFilterRequest.includes('vistasDespejadas@=*,')) {
      urlFilterRequest = urlFilterRequest.split('vistasDespejadas@=*,').join('');
    }
    if (this.searchOption != 'Vivienda') {
      // se añade el model porque hay que tirar de herencia
      urlFilterRequest = urlFilterRequest.split(',&sorts=').join(',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',model@=*Other' + ',&sorts=');
    } else {
      urlFilterRequest = urlFilterRequest.split(',&sorts=').join(',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',&sorts=')
    }
    console.log(urlFilterRequest);
    this.loadMarkers(urlFilterRequest);
  }

  // cambio de condición borra el mapa
  hideValues4share: string = '';
  public clearMap(flag: any) {
    this.myMap = new Map<string, string>(JSON.parse(localStorage.getItem("detailFiltersMap")));
    localStorage.removeItem('detailFiltersMap');
    if (flag == 'full-clear') {
      this.myMap.clear();
      this.myMap.set('condicion', 'Venta');
      this.hideValues4share = '';
      /*if (this.searchOption != 'Vivienda') {
        this.filter(this.searchOption, 'prototipo');
      }*/
    } else {
      this.myMap.set('condicion', flag);
      this.hideValues4share = '';
    }
    localStorage.setItem('detailFiltersMap', JSON.stringify([...this.myMap]));
    this.wordCount = 0;
    this.homeFiltersRequest.keywords = '';
    if (this.boxedPoints) {
      if (this.searchOption != 'Vivienda') {
        this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',model@=*Other' + ',&sorts=');
      } else {
        this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag + ',lng>=' + this.boxedPoints[0] + ',lat>=' + this.boxedPoints[1] + ',lng<=' + this.boxedPoints[2] + ',lat<=' + this.boxedPoints[3] + ',prototipo@=*' + this.searchOption + ',&sorts=')
      }
    } else {
      this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
    }
  }

  // searchOption

  wordCount: number;
  public wordCounter() {
    // setTimeout(() => {
    this.wordCount = wordsCounter(this.homeFiltersRequest.keywords).wordsCount;
    this.filter(this.homeFiltersRequest.keywords, 'descripcion');
    console.log(this.homeFiltersRequest.keywords);
    if (this.wordCount == 0 && this.myMap.has('descripcion')) {
      this.myMap.delete('descripcion');
    }
    //}, 2000);
  }

  applyCaptureNameFilter() {
    console.log(this.homeFiltersRequest.keywords);
  }

  loadScripts() {
    const dynamicScripts = [
      '../../assets/js/home.js',
      '../../assets/js/leaflet.markercluster-src.js',
      '../../assets/js/leaflet.markercluster.js'
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  myFavourites() {
    this.router.navigate(['/user-pro'], { state: { tab: 'favourites' } });
  }

  ngOnDestroy(): void {
    /*for (let i = 0; i < cssPathHome.length; i++) {
      this.renderer2.removeChild(this.document.head, this.styleUser[i]);
    }*/
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
