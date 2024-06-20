import {
  PropertyType, HouseType, Bedrooms, Bathrooms, Badge, PropertyState, Enseñanza, Institucion,
  RamasConocimiento, EmisionesCO2, ConsumoEnergetico, TipoDeVia, Orientacion, Provincias, PrecioMinimoAlquiler,
  PrecioMaximoAlquiler, PrecioMinimoVenta, PrecioMaximoVenta, Superficie, Views, PropertyShareType, CarPlaces,
  PropertyTypeSelectHeader,
  HouseTypeFilters,
  PropertyFilterOptions,
} from './../class/property-type.enum';
import { UserService } from './../service/user.service';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { marker, LatLng, circleMarker } from 'leaflet';
import 'leaflet.locatecontrol';
import {
  tileLayerSelect, tileLayerCP, tileLayerWMSSelect, tileLayerHere, tileLayerWMSSelectIGN, tileLayerTransportes,
  Stadia_OSMBright, OpenStreetMap_Mapnik, CartoDB_Voyager, Thunderforest_OpenCycleMap, Jawg_Sunny
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
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroupDirective, NgModel } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import { APIKEY } from 'src/environments/environment.prod';
import * as $ from 'jquery';
import Axios from 'axios-observable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import wordsCounter from 'word-counting'
import { MatSidenav } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../model/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', 'custom-leaflet.css'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent extends UserComponent implements OnInit, OnDestroy {
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
    primengConfig: PrimeNGConfig,
    protected nzMessage: NzMessageService
  ) {
    super(router, authenticationService, userService, notificationService, route, toastr, document,
      renderer2, primengConfig);
  }

  map!: L.map; // map allocates homes
  map2!: L.Map; // map geocoding search location
  map3!: L.Map; // map to set nearly services
  //hereMap!: H.Map;
  lg = new L.LayerGroup(); // para añadir un nuevo marker
  contained = new L.LayerGroup(); // responde a los eventos de mapa cargando los markers en su area visible
  mp!: L.Marker;
  markerHouse!: L.Marker; // punto de referencia para los servicios
  markerSchool!: L.Marker;
  fg = L.featureGroup(); // template for services
  popup = L.popup();
  beforeCoords!: L.LatLng; // app user coordinates at the beggining
  afterCoords!: L.LatLng; // coordinates where the user wants to put his house
  nextCoords!: L.LatLng; // temp coordinates to put any service
  public adTitle = new BehaviorSubject<string>('Nueva propiedad');
  public adTitleAction$ = this.adTitle.asObservable();
  home: Home = new Home();
  homeFiltersRequest: HomeFilterRequest = new HomeFilterRequest();
  homes: Home[] = [];
  state: boolean = this.authenticationService.isUserLoggedIn();
  opt = {};
  mydate = new Date().getTime();
  condicion: string[] = Object.values(PropertyType);
  condicionHeader: string[] = Object.values(PropertyTypeSelectHeader);
  condicionFiltros: string[] = Object.values(PropertyFilterOptions);
  condicion2: string[] = Object.values(PropertyShareType);
  tipo: string[] = Object.values(HouseType);
  tipoFilters: string[] = Object.values(HouseTypeFilters);
  bedrooms: string[] = Object.values(Bedrooms);
  bathrooms: string[] = Object.values(Bathrooms);
  badge: string[] = Object.values(Badge);
  propertyState: string[] = Object.values(PropertyState);
  ensenyanza: string[] = Object.values(Enseñanza);
  institucion: string[] = Object.values(Institucion);
  ramas: string[] = Object.values(RamasConocimiento);
  calificacion_emisiones: string[] = Object.values(EmisionesCO2);
  calificacion_consumo: string[] = Object.values(ConsumoEnergetico);
  tipo_de_via: string[] = Object.values(TipoDeVia);
  orientacion: string[] = Object.values(Orientacion);
  bathRooms: string[] = Object.values(Bathrooms);
  provincias: string[] = Object.values(Provincias);
  precioMinimoAlquiler: string[] = Object.values(PrecioMinimoAlquiler);
  precioMaximoAlquiler: string[] = Object.values(PrecioMaximoAlquiler);
  precioMinimoVenta: string[] = Object.values(PrecioMinimoVenta);
  precioMaximoVenta: string[] = Object.values(PrecioMaximoVenta);
  superficie: string[] = Object.values(Superficie);
  carPlaces: string[] = Object.values(CarPlaces);
  value!: number;
  decision: any[] = [
    { name: 'Aprox.', value: false },
    { name: 'Exacta', value: true }
  ];
  modalFooterNull = null;
  shinePopup: boolean = false; //skeleton
  vistas: string[] = Object.values(Views);
  popupOpenViviendaId: string;
  cardCheckedViviendaId: string;
  anyPopupOpen: boolean = false;
  images = new Array<HomeImage>();// new Array(30).fill('');
  routerLinkId: number = 0;
  routerLinkModel: string;
  filterRentSalePriceFlag: string = 'Venta';
  mapRentSalePriceFlag: string = 'Venta';
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
  stateTexfields = Array.from({ length: 4 }, () => new Array(6).fill(false));
  // add-delete temp routes
  mapEvents = new Set<string>();
  // save points
  nearlyMarkers = new Map<string, L.Marker>();


  // icons
  bch = beachIcon;
  airp = airportIcon;
  mki = marketIcon;
  swi = subwayIcon;
  busic = busIcon;
  sc = schoolIcon;
  uni = universityIcon;
  customIcon: any;

  resizeStyleListSidenav = { "max-width": `50%`, };

  // modal new property title 
  public setAdTitle(adTitle: string): void {
    this.adTitle.next(adTitle);
  }

  public restoreMap() {
    this.lg.clearLayers();
    this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
  }

  @ViewChild('newMarkerForm') newMarkerForm: FormGroupDirective;
  // show/hide 2nd modal
  @ViewChild('element') element: ElementRef;
  @ViewChild('map_3') map_3?: ElementRef;
  @ViewChild('sidenav') sidenav: MatSidenav;

  public openToogleModal(flag: boolean) {
    if (flag) {
      if (this.afterCoords == null || this.afterCoords == undefined) {
        // remove to production
        this.afterCoords = this.beforeCoords;
      }
      this.nextCoords = this.afterCoords;
      this.element.nativeElement.classList.add('modal-open');
      // cargar el siguiente mapa
      if (this.map3 == undefined) {
        this.map3 = L.map('map_3', {
          renderer: L.canvas(),
          invalidateSize: true,
        }).setView([this.afterCoords.lat, this.afterCoords.lng], 15);
        //Stadia_OSMBright().addTo(this.map3);
        Jawg_Sunny().addTo(this.map3);
        this.markerHouse = new L.marker(this.afterCoords, {
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
    jCol: number
  ) {
    this.nextCoords = this.afterCoords;
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
      Jawg_Sunny().addTo(this.map3);
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
        L.latLng(this.afterCoords.lat, this.afterCoords.lng),
        L.latLng(this.nextCoords.lat - 0.001, this.nextCoords.lng + 0.001),
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
            <div class="buttons has-addons is-centered " style="left:-0.18em;top:0;botton:0;position:absolute; ">
              <button class="button is-link" onclick="saveService()">Guardar</button>
              <button class="button is-link is-light" onclick="closeSmallPopup()">Cancelar</button>
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
      //this.nextCoords=e.waypoints;
      console.log(
        (summary.totalDistance / 1000).toFixed(2) +
        ' km. ' +
        Math.round((summary.totalTime % 3600) / 60) +
        ' minutos'
      );
      var waypoints = e.waypoints || [];
      var destination = waypoints[waypoints.length - 1];
      this.nextCoords = destination.latLng;
      console.log(this.nextCoords);
      switch (this.serviceGoal) {
        case 'colegio':
          this.colegio[this.indexGoal].lat = this.nextCoords.lat;
          this.colegio[this.indexGoal].lng = this.nextCoords.lng;
          this.colegio[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.colegio[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'universidad':
          this.universidad[this.indexGoal].lat = this.nextCoords.lat;
          this.universidad[this.indexGoal].lng = this.nextCoords.lng;
          this.universidad[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.universidad[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'autobus':
          this.autobus[this.indexGoal].lat = this.nextCoords.lat;
          this.autobus[this.indexGoal].lng = this.nextCoords.lng;
          this.autobus[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.autobus[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'metro':
          this.metro[this.indexGoal].lat = this.nextCoords.lat;
          this.metro[this.indexGoal].lng = this.nextCoords.lng;
          this.metro[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.metro[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'mercados':
          this.mercados[this.indexGoal].lat = this.nextCoords.lat;
          this.mercados[this.indexGoal].lng = this.nextCoords.lng;
          this.mercados[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.mercados[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'aeropuerto':
          this.aeropuerto[this.indexGoal].lat = this.nextCoords.lat;
          this.aeropuerto[this.indexGoal].lng = this.nextCoords.lng;
          this.aeropuerto[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.aeropuerto[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
        case 'beach':
          this.beach[this.indexGoal].lat = this.nextCoords.lat;
          this.beach[this.indexGoal].lng = this.nextCoords.lng;
          this.beach[this.indexGoal].distancia =
            (summary.totalDistance / 1000).toFixed(2) + ' km.';
          this.beach[this.indexGoal].tiempo =
            Math.round((summary.totalTime % 3600) / 60) + ' minutos';
          break;
      }
    });
    this.mapEvents.add('control');
    //control.on('waypointschanged', ()=>);
    /*this.mp.on('move', () => (this.afterCoords = this.mp.getLatLng()));
    this.mp.on('moveend', () => console.log(this.afterCoords));
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
    }
  }

  defineModel(houseType: string): string {
    if (houseType == 'Piso' || houseType == 'Apartamento' || houseType == 'Estudio' || houseType == 'Ático' || houseType == 'Duplex') {
      return 'Flat';
    } else if (houseType == 'Chalet' || houseType == 'Adosado' || houseType == 'Pareado' || houseType == 'Casa Rústica' || houseType == 'Villa') {
      return 'House';
    } else if (houseType == 'Habitación') {
      return 'Room';
    }
  }

  saveService() {
    var x = document.getElementById(this.buttonBefore);
    x.style.display = 'none';
    x = document.getElementById(this.buttonAfter);
    x.style.display = 'block';
    x = document.getElementById(this.buttonDelete);
    x.style.display = 'block';
    this.stateTexfields[this.row][this.col] = true;
    console.log(this.stateTexfields);
    if (this.mapEvents.has('control')) {
      this.map3.eachLayer(function (layer) {
        layer.remove();
      });
      Jawg_Sunny().addTo(this.map3);
      this.mapEvents.delete('control');
    }
    this.markerHouse.addTo(this.map3);
    /*formatParamMarker: L.Marker([this.nextCoords.lat,this.nextCoords.lng],{icon:this.customIcon, draggable:false});
      this.nearlyMarkers.set(this.indexGoal.toString()+this.serviceGoal.toString(),this.mp);
      this.nearlyMarkers.forEach((key:string,value:L.marker)=>{
         marker:L.marker([value.lat,value.lng]).addTo(this.map3);
      })*/
    //this.map3.flyTo([this.afterCoords.lat, this.afterCoords.lng], 20);
    //console.log(this.row + ' ' );
    /*switch(this.serviceGoal){
      case 'colegio':
        this.colegio[this.indexGoal]
    }*/
    // this.colegio[0].distancia=;
    /*console.log('Estás en ts !!!');
     console.log();
     var x = JSON.stringify(this.colegio)
     var y = JSON.parse(x);*/

    /*for (let i = 0; i < this.aeropuerto.length; i++) {
      console.log(this.aeropuerto[i])
     }*/
  }

  reRackService(row: number, col: number, btnBeforeId: string, btnAfterId: string, btnDltId: string) {
    var x = document.getElementById(btnBeforeId); //  array:string, index:number,
    x.style.display = 'block';
    x = document.getElementById(btnAfterId);
    x.style.display = 'none';
    x = document.getElementById(btnDltId);
    x.style.display = 'none';
    this.stateTexfields[row][col] = false;
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
    }
  }

  //modal primeng
  mainModal: boolean = false;
  showDialog() {
    this.mainModal = true;
  }
  closeDialog() {
    this.mainModal = false;
  }

  carPlacesIndex = 0;
  @ViewChild('parkingOptional') parkingOptional: ElementRef;
  addParkingPrice(input: HTMLInputElement): void {
    if (this.parkingOptional.nativeElement.value) {
      const value = input.value;
      if (this.carPlaces.indexOf(value) == -1) {
        this.carPlaces = [...this.carPlaces, input.value || `New item ${this.carPlacesIndex++}`];
      }
    }
  }

  setDate(result: Date) {
    if (result) {
      console.log(this.home.antiguedad.toString().substring(11, 15));
    }
  }

  fechaDisponibleAlquiler: any;
  setDisponibilidad(result: Date) {
    if (result) {
      console.log(this.home.disponibilidad);
      var disponible = this.home.disponibilidad.toString().substring(4, 7);
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
      console.log(this.fechaDisponibleAlquiler);
    }
  }

  // tamaño de los select para las tablas de proximidades
  size: NzSelectSizeType = 'small';
  sizeM: NzSelectSizeType = 'default';
  sizeL: NzSelectSizeType = 'large';

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

  showCityResult() {
    if (this.home.ciudad == null) {
      alert('Introduzca la provincia!');
    } else {
      console.log(this.home.ciudad);
      var x = document.getElementById('provButton');
      $('.is-danger').addClass('is-success');
      $('.is-success').removeClass('is-danger');
      this.home.ciudad = this.home.ciudad.split(' ')[0].replace(',', '');
      x.innerHTML = this.home.ciudad;
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
        this.getLocation();
        Stadia_OSMBright().addTo(this.map2);
        //tileLayerHere().addTo(this.map2);
        this.map2.addControl(search);
      }, 300)
    }
  }

  public loadMarkers(url: string) {
    this.ngOnDestroy();
    this.getLocation();
    this.map.eachLayer((layer) => {
      layer.remove();
    });
    //tileLayerSelect().addTo(map);
    //tileLayerWMSSelect().addTo(map);
    //tileLayerCP().addTo(map); // Codigos postales
    //tileLayerWMSSelectIGN().addTo(this.map);
    //Stadia_OSMBright().addTo(this.map);
    Jawg_Sunny().addTo(this.map);
    //tileLayerHere().addTo(this.map);
    this.subscriptions.push(
      this.homeService.getHomesByQuery(url).subscribe((data) => {
        data.map((Home) => {
          Home.images = JSON.parse(Home.imagesAsString);
          //if(this.map.getBounds().contains([Home.lat,Home.lng])) { 
          marker(
            [Number(Home.lat), Number(Home.lng)],
            {
              icon: new L.DivIcon({
                className: 'custom-div-icon',
                html: `<div class="property-pill streamlined-marker-container streamlined-marker-position pill-color-forsale with-icon"
                            role="link"
                            tabindex="-1"
                            data-test="property-marker">
                            <div class="icon-text" style="display: inline-block; overflow: hidden;">${this.drawMarker(Home)}€</div>
                        </div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
              }),
            },
            this.opt
          )
            .bindPopup(
              `
              <div class="reale1 row">
                <div class="reale2" col-sm-6>
                   <div class="reale3" >
                      <div class="reale5">
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
                      <div class="col-sm-6 realeTextContainer">
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
              localStorage.removeItem('currentBuilding'),
                localStorage.setItem('currentBuilding', JSON.stringify(Home)),
                this.dynamicCarousel(Home.images),
                this.drawPopup(Home),
                this.setPopupBranding(Home),
                this.popupOpenViviendaId = Home.viviendaId
            })
            .on('popupopen', () => {
              this.routerLinkId = +Home.id;
              this.routerLinkModel = Home.model;
              this.anyPopupOpen = true;
              setTimeout(() => {
                if (this.state) {
                  for (let i = 0; i < this.user.likePreferences.length; i++) {
                    if (this.user.likePreferences[i] == Home.viviendaId) {
                      var auxId = 'cuore' + this.popupOpenViviendaId;
                      const doc = document.getElementById(auxId) as HTMLInputElement;
                      doc.checked = true;
                      const doc2 = document.getElementById(Home.viviendaId) as HTMLInputElement;
                      doc2.checked = true;
                    }
                  }
                }
              }, 250)
            }).on('popupclose', () => {
              this.anyPopupOpen = false;
            }
            ).addTo(this.map)
        })
        this.homes = data;
      }),
    );
  }

  lockCardLike: boolean = false;
  cuoreLikeFeature(attr: string) {
    if (this.lockCardLike) {
      if (this.state) {
        this.lockCardLike = false;
        var homeValue = '';
        if (attr != 'popup') { // card calls
          this.cardCheckedViviendaId = attr;
          if (this.cardCheckedViviendaId != this.popupOpenViviendaId) {
            homeValue = this.cardCheckedViviendaId;
          }
        } else { // has it
          homeValue = this.popupOpenViviendaId;
        }
        // ya lo tenía
        if (this.user.likePreferences.includes(homeValue)) {
          this.user.likePreferences.forEach((item, index) => {
            if (item == homeValue) this.user.likePreferences.splice(index, 1);
          });
          this.user.likePreferencesAsString = this.user.likePreferences.toString();
          this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
            next: (res: User) => {
              this.user = this.userService.performUser(res);
              this.authenticationService.addUserToLocalCache(this.user);
              this.createMessage("success", "Borrado desde favoritos");
            },
            error: (err: any) => {
              this.notificationService.notify(NotificationType.ERROR, err);
            }
          }));
          if (attr == 'popup') {
            this.clickButton(this.popupOpenViviendaId);
            setTimeout(() => {
              this.lockCardLike = true;
            }, 500);
          } else {
            if (this.anyPopupOpen && this.popupOpenViviendaId === this.cardCheckedViviendaId) {
              var auxId = 'cuore' + this.cardCheckedViviendaId;
              const doc = document.getElementById(auxId) as HTMLInputElement;
              doc.click();
            }
            setTimeout(() => {
              this.lockCardLike = true;
            }, 500);
          }
          // not has it
        } else {
          this.lockCardLike = false;
          this.user.likePreferences.push(homeValue);
          this.user.likePreferencesAsString = this.user.likePreferences.toString();
          this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
            next: (res: User) => {
              this.user = this.userService.performUser(res);
              this.authenticationService.addUserToLocalCache(this.user);
              this.createMessage("success", "Guardado en favoritos");
            },
            error: (err: any) => {
              this.notificationService.notify(NotificationType.ERROR, err);
            }
          }));
          if (attr == 'popup') {
            this.clickButton(this.popupOpenViviendaId);
            setTimeout(() => {
              this.lockCardLike = true;
            }, 500);
          } else {
            if (this.anyPopupOpen && this.popupOpenViviendaId === this.cardCheckedViviendaId) {
              var auxId = 'cuore' + this.cardCheckedViviendaId;
              const doc = document.getElementById(auxId) as HTMLInputElement;
              doc.click();
            }
            setTimeout(() => {
              this.lockCardLike = true;
            }, 500);
          }
        }
      } else {
        this.lockCardLike = false;
        if (attr != 'popup') { // card calls
          this.cardCheckedViviendaId = attr;
        }
        setTimeout(() => {
          if (attr == 'popup') {
            var auxId = 'cuore' + this.popupOpenViviendaId;
            const doc = document.getElementById(auxId) as HTMLInputElement;
            doc.click();
            this.joinUsModal = true;
          } else {
            this.clickButton(this.cardCheckedViviendaId);
            this.joinUsModal = true;
          }
        }, 300);
        setTimeout(()=>{
          this.lockCardLike = true;
        },500);
      }
    }
  }

  // nzMessages
  createMessage(type: string, content: string): void {
    this.nzMessage.create(type, content);
  }

  setPopupBranding(home: Home) {
    if (home.proColor != null || home.proColor != undefined) {
      var x = document.getElementById('brandingcontainer');
      x.style.display = 'flex';
      x.style.backgroundColor = home.proColor;
      if (home.proImage != null || home.proImage != undefined) {
        $('<img class="branding-image-popup" src="' + home.proImage + '" >').appendTo('.brandingcontainer');
      }
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
  // pinta el precio en los marker y en las tarjetas del listado
  drawMarker(home: Home): string {
    if (home.condicion == 'Alquiler') {
      return this.formatNumberWithCommas(home.precioAlquiler);
    } else if (home.condicion == 'Venta' || home.condicion == 'Alquiler y venta') {
      return this.formatNumberWithCommas(home.precioFinal);
    } else if (home.condicion == 'Compartir') {
      return this.formatNumberWithCommas(home.precioAlquiler);
    }
  }

  drawPopup(h: Home) {
    if (h.condicion == 'Venta') {
      $('.p_2').text(this.formatNumberWithCommas(h.precioFinal) + '€');
      $('.p_1_2').text('En ' + h.condicion);
    } else if (h.condicion == 'Alquiler') {
      $('.p_2').text(this.formatNumberWithCommas(h.precioAlquiler) + '€');
      $('.p_1_2').text('En ' + h.condicion);
    } else if (h.condicion == 'Alquiler y venta') {
      $('<div class="p_2Prices">' + this.formatNumberWithCommas(h.precioFinal) + '€' + '<span style="color:#d9d9d9;">&nbsp;<i class="bi bi-grip-vertical"></i>&nbsp;</span>' + this.formatNumberWithCommas(h.precioAlquiler) + '€</div>').appendTo('.p_2');
      $('.p_1_2').text('En ' + h.condicion);
    } else if (h.condicion == 'Compartir') {
      $('.p_2').text(this.formatNumberWithCommas(h.precioAlquiler) + '€');
      $('.p_1_2').text(h.condicion + ' vivienda');
    }
    if (h.model == 'House' || h.model == 'Flat' || h.model == 'Room') {
      $('<div class="popup-features d-flex flex-start" id="popup-features"><ion-icon style="font-size:1em; position:relative;" src="assets/svg/bed-horizontal.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + h.habitaciones + '</span>&nbsp;&nbsp;&nbsp;' +
        '<ion-icon style="font-size:1em; position:relative;" src="assets/svg/bath_tub.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + h.aseos + '</span>&nbsp;&nbsp;&nbsp;' +
        '<ion-icon style="font-size:1em; color:#666;" src="assets/svg/size-popup.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + h.superficie + "m²" + '</span>&nbsp;&nbsp;</div>'
      ).appendTo('.ul_features');
      if (h.garage > 0) {
        if (h.garage > 10) {
          $('<ion-icon style="font-size:1em; position:relative;" src="assets/svg/car-popup.svg"></ion-icon><ion-icon style="color:#8dca3f; margin-top:2px;" name="add-outline"></ion-icon><span class="numbers-font" style="color:#8dca3f;font-size:0.9em;">'
            + this.formatNumberWithCommas(h.garage) + '€</span>').appendTo('.p_features');
        } else {
          $('<ion-icon style="font-size:1.1em; position:relative;" src="assets/svg/car-popup.svg"></ion-icon><span class="numbers-font" style="color:#b4b4b4;">'
            + h.garage + '</span>').appendTo('.p_features');
        }
      }
    }
    if (h.piso != null || h.piso != undefined) {
      $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; position:relative;" src="assets/svg/stairs-tab.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + h.piso + '</span></div>&nbsp;').appendTo('.popup-features');
      /*if (newHome.ascensor) {
        $('<div class="d-flex flex-start"><ion-icon style="font-size:1em; position:relative;" src="assets/svg/popup-elevator.svg"></ion-icon></div>').appendTo('.popup-features');
      }*/
    }
    var playa: Beach[] = JSON.parse(h.distanciaAlMar);
    if (playa[0].distancia.length != 0) {
      $('<div class="d-flex flex-start">&nbsp;&nbsp;&nbsp;<ion-icon style="font-size:1em; position:relative;" src="assets/svg/sea.svg"></ion-icon>&nbsp;<span class="numbers-font" style="font-size:0.9em;color:#b4b4b4;">' + playa[0].distancia + '</span></div>&nbsp;').appendTo('.p_features');
    }





    if (h.direccionAproximada) {
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
      localStorage.removeItem('currentBuilding');
      localStorage.setItem('currentBuilding', JSON.stringify(home));
      this.routerLinkId = +home.id;
      this.routerLinkModel = home.model;
      if (flag == 'home') {
        setTimeout(() => {
          $('#linkPopup').trigger('click');
        }, 100);
      } else if (flag == 'ad' || flag == 'list') {
        setTimeout(() => {
          this.clickButton('linkPopup');
        }, 100);
      }
    }
  }

  /************************************************************/
  ngOnInit(): void {
    this.map = L.map('map', { renderer: L.canvas() }).setView(
      [39.46975, -0.37739],
      16  //25
    ).on('zoomend', () => {
      /*
      * Aquí puede cargar las viviendas respondiendo al zoom.
      * this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag)
      * Y lo mismo para moveend
      */
    }).on('moveend', () => {
      /*
      * console.log('mover');
        * setTimeout(()=>{
        * this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
      * },1000);
      */
    })
    this.user = this.authenticationService.getUserFromLocalCache();
    this.userMarkerEvents();
    this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag); // by default load for sale 
    this.loadScripts();
    this.clearMap();
    if (this.authenticationService.isUserLoggedIn()) {
      this.setCardLike();
    }
    setTimeout(() => { this.lockCardLike = true; }, 2000);
  }

  @ViewChildren('redheartcheckbox') likes4ever: QueryList<ElementRef>
  setCardLike() {
    if (this.user.likePreferencesAsString) {
      setTimeout(() => {
        if (this.state) {
          this.likes4ever.forEach(el => {
            this.user.likePreferences.forEach(like => {
              if (el.nativeElement.id == like) {
                el.nativeElement.click();
              }
            });
          });
        }
      }, 1000);
    }
  }

  /* marker options */
  userMarkerEvents() {
    if (this.state) {
      this.opt = { draggable: true, locateControl: true, bounceOnAdd: true };
    } else {
      this.opt = { draggable: false, locateControl: true };
    }
  }

  getLocation() {
    this.map.on('locationfound', (e: { accuracy: number; latlng: LatLng }) => {
      this.beforeCoords = e.latlng; //Object.assign({}, e.latlng);
      this.map.setView(this.beforeCoords, 16); // poner el foco en el mapa
      this.map.fitBounds([[this.beforeCoords.lat, this.beforeCoords.lng]]); // por si acaso..
    });
    this.map.on('locationerror', this.notFoundLocation); // si el usuario no activa la geolocalización
    this.map.locate({ setView: true, maxZoom: 16 }); // llamada para que la geolocalización funcione
  }

  notFoundLocation() {
    alert(
      'Si ya ha iniciado sesión, habilite la Geolocalización o espere a que el navegador se posicione. Sino recarge la página o inicie esta ventana en otro navegador'
    );
  }

  createLocationMarker() {
    // hay que recorrer layergroup para borrarlo si existe y que no solape
    this.lg.clearLayers();
    //this.map.flyTo([this.beforeCoords],25,{ animate:true,duration:1.5 });
    console.log(this.beforeCoords);
    this.afterCoords = this.beforeCoords;
    /*this.notificationService.notify(
      NotificationType.INFO,
      'Mueve el marcador hasta su propiedad'
    );*/
    this.toastr.success(
      'Arrastra el marcador!',
      'Mueve el marcador hasta su propiedad!'
    );
    this.mp = new L.marker(this.beforeCoords, {
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
    this.lg = new L.LayerGroup([this.mp]);
    this.lg.addTo(this.map);

    /*const popupItem=L.popup().setLatLng(this.beforeCoords)
      .setContent('<h5>Arrastrame a una ubicación exacta</h5>')
      .openOn(this.mp);*/
    this.mp.on('move', () => (this.afterCoords = this.mp.getLatLng()));
    this.mp.on('moveend', () => console.log(this.afterCoords));
    this.mp.on('dragend', () => this.mp.openPopup());
    this.map.flyTo([this.beforeCoords.lat, this.beforeCoords.lng], 18);
  }

  // Revisar - en el html -> oninput="textAreaResize(this)"
  textAreaResize(e) {
    e.style.height = '5px';
    e.style.height = e.scrollHeight + 'px';
  }

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  filesUploadSuccessfully: number = 0;
  // fix the previews
  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  rentTab = new BehaviorSubject<boolean>(false);
  shareTab = new BehaviorSubject<boolean>(undefined);
  saleTab = new BehaviorSubject<boolean>(false);
  conditionTabs() {
    if (this.home.tipo == 'Habitación') {
      this.shareTab.next(false);
      this.saleTab.next(true);
      this.rentTab.next(false);
      var x = document.getElementById('kompartirTitle');
      x.style.textDecoration = 'none';
      var y = document.getElementById('alquilerTitle');
      y.style.textDecoration = 'none';
      this.home.precioFinal = null;
      this.home.condicion = 'Compartir';
    } else if (this.home.condicion == 'Venta') {
      this.rentTab.next(true);
      this.shareTab.next(true);
      this.saleTab.next(false);
      var x = document.getElementById('alquilerTitle');
      x.style.textDecoration = 'line-through';
      var y = document.getElementById('kompartirTitle');
      y.style.textDecoration = 'line-through';
      this.home.precioAlquiler = null;
    } else if (this.home.condicion == 'Alquiler y venta') {
      this.shareTab.next(true);
      this.rentTab.next(false);
      this.saleTab.next(false);
      var y = document.getElementById('kompartirTitle');
      y.style.textDecoration = 'line-through';
      var x = document.getElementById('alquilerTitle');
      x.style.textDecoration = 'none';
    } else if (this.home.condicion == 'Alquiler') {
      var y = document.getElementById('kompartirTitle');
      y.style.textDecoration = 'line-through';
      var x = document.getElementById('alquilerTitle');
      x.style.textDecoration = 'none';
      this.saleTab.next(true);
      this.shareTab.next(true);
      this.home.precioFinal = null;
      this.rentTab.next(false);
    } else {
      this.shareTab.next(undefined);
      this.saleTab.next(false);
    }
  }

  getShareTab(): boolean {
    return this.shareTab.getValue();
  }
  getRentTab(): boolean {
    return this.rentTab.getValue();
  }

  tabIndex: number = 0;
  increaseTab() {
    if (this.tabIndex <= 4) {
      if (this.home.condicion == 'Venta' && this.tabIndex == 1) {
        this.tabIndex = 4;
      } else if (this.home.condicion == 'Alquiler' || this.home.condicion == 'Alquiler y venta' && this.tabIndex == 2) {
        this.tabIndex = 4;
      } else {
        this.tabIndex++;
      }
      if (this.tabIndex == 5) {
        var x = document.getElementById('nextTab');
        x.style.display = 'none';
      }
    }
    if (this.tabIndex == 1) {
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    }
  }
  decreaseTab() {
    if (this.tabIndex >= 1) {
      if (this.home.condicion == 'Venta' && this.tabIndex == 4) {
        this.tabIndex = 1;
      } else if (this.home.condicion == 'Alquiler' || this.home.condicion == 'Alquiler y venta' && this.tabIndex == 4) {
        this.tabIndex = 2;
      } else {
        this.tabIndex--;
      }
      if (this.tabIndex == 5) {
        var x = document.getElementById('prevTab');
        x.style.display = 'none';
      }
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
      this.tabIndex = 4;
      var x = document.getElementById('nextTab');
      x.style.display = 'block';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    } else if (flag == 'Multimedia') {
      this.tabIndex = 5;
      var x = document.getElementById('nextTab');
      x.style.display = 'none';
      var x = document.getElementById('prevTab');
      x.style.display = 'block';
    }
  }

  public isHighEficiency(): boolean {
    return this.home.emisiones.charAt(0) == 'A' && this.home.consumo.charAt(0) == 'A';
  }

  rotateArrows(e: any, id: string) {
    if (e)
      $("." + id).find(".ant-select-arrow").toggleClass("ant-select-arrow-down");
    else
      $("." + id).find(".ant-select-arrow").removeClass("ant-select-arrow-down");
  }

  newHome() {
    this.lg.remove(this.mp);
    const formData = new FormData();
    formData.append('lat', this.afterCoords.lat);
    formData.append('lng', this.afterCoords.lng);
    formData.append('ciudad', this.home.ciudad);
    formData.append('calle', this.home.calle);
    formData.append('numero', this.home.numero);
    formData.append('cp', this.home.cp);
    formData.append('superficie', JSON.stringify(this.home.superficie).split('"').join('').split("'").join(''));
    formData.append('condicion', this.home.condicion);
    formData.append('tipo', this.home.tipo);
    formData.append('orientacion', this.propertyGuidance(this.home.orientacion));
    formData.append('distrito', this.home.distrito);
    formData.append('tipoDeVia', this.home.tipoDeVia);
    formData.append('habitaciones', JSON.stringify(this.home.habitaciones).split('"').join('').split("'").join(''));
    formData.append('aseos', JSON.stringify(this.home.aseos).split('"').join('').split("'").join(''));
    formData.append('estado', this.home.estado);
    formData.append('destacar', this.home.destacar);
    formData.append('antiguedad', this.home.antiguedad.toString().substring(11, 15).split('"').join('').split("'").join(''));
    formData.append('aireAcondicionado', JSON.stringify(this.home.aireAcondicionado));
    formData.append('panelesSolares', JSON.stringify(this.home.panelesSolares));
    formData.append('gasNatural', JSON.stringify(this.home.gasNatural));
    formData.append('calefaccion', JSON.stringify(this.home.calefaccion));
    formData.append('emisiones', this.home.emisiones);
    formData.append('consumo', this.home.consumo);
    formData.append('eficienciaEnergetica', JSON.stringify(this.isHighEficiency()));
    formData.append('ascensor', JSON.stringify(this.home.ascensor));
    formData.append('gym', JSON.stringify(this.home.gym));
    formData.append('tenis', JSON.stringify(this.home.tenis));
    formData.append('padel', JSON.stringify(this.home.padel));
    formData.append('piscinaComp', JSON.stringify(this.home.piscinaComp));
    formData.append('zonaDeOcio', JSON.stringify(this.home.zonaDeOcio));
    formData.append('videoPortero', JSON.stringify(this.home.videoPortero));
    formData.append('sauna', JSON.stringify(this.home.sauna));
    formData.append('jacuzzi', JSON.stringify(this.home.jacuzzi));
    formData.append('golf', JSON.stringify(this.home.golf));
    formData.append('jardin', JSON.stringify(this.home.jardin));
    formData.append('columpios', JSON.stringify(this.home.columpios));
    formData.append('recepcion24_7', JSON.stringify(this.home.recepcion24_7));
    formData.append('videoVigilancia', JSON.stringify(this.home.videoVigilancia));
    formData.append('alarmaIncendios', JSON.stringify(this.home.alarmaIncendios));
    formData.append('extintores', JSON.stringify(this.home.extintores)); // rociadores de incendio
    formData.append('generadorEmergencia', JSON.stringify(this.home.generadorEmergencia));
    formData.append('instalacionesDiscapacitados', JSON.stringify(this.home.instalacionesDiscapacitados));
    formData.append('terraza', JSON.stringify(this.home.terraza));
    formData.append('amueblado', JSON.stringify(this.home.amueblado));
    formData.append('parquet', JSON.stringify(this.home.parquet));
    formData.append('trastero', JSON.stringify(this.home.trastero));
    formData.append('armariosEmpotrados', JSON.stringify(this.home.armariosEmpotrados));
    formData.append('piscinaPrivada', JSON.stringify(this.home.piscinaPrivada));
    formData.append('balcon', JSON.stringify(this.home.balcon));
    formData.append('vistasDespejadas', JSON.stringify(this.home.vistasDespejadas).split('"').join('').split("'").join(''));
    formData.append('colegios', JSON.stringify(this.colegio));
    formData.append('universidades', JSON.stringify(this.universidad));
    formData.append('supermercados', JSON.stringify(this.mercados));
    formData.append('metro', JSON.stringify(this.metro));
    formData.append('bus', JSON.stringify(this.autobus));
    formData.append('aeropuerto', JSON.stringify(this.aeropuerto));
    formData.append('distanciaAlMar', JSON.stringify(this.beach));
    formData.append('descripcion', this.home.descripcion);
    formData.append('Model', this.defineModel(this.home.tipo));
    formData.append('creador', this.user.userId);
    formData.append('nombreCreador', this.user.username);
    formData.append('idCreador', this.user.userId);
    formData.append('cabinaHidromasaje', JSON.stringify(this.home.cabinaHidromasaje));
    formData.append('direccionAproximada', JSON.stringify(this.home.direccionAproximada).split('"').join('').split("'").join(''));
    formData.append('politicaPrivacidad', JSON.stringify(this.home.politicaPrivacidad));
    if (this.home.piso) {
      formData.append('piso', this.home.piso + "/" + this.home.plantaMasAlta);
    }
    if (this.home.garage) {
      formData.append('garage', JSON.stringify(this.home.garage).split('"').join('').split("'").join(''));
    }
    if (this.home.aseoEnsuite) {
      formData.append('aseoEnsuite', JSON.stringify(this.home.aseoEnsuite).split('"').join('').split("'").join(''));
    }
    if (this.home.video) {
      var splitLink = this.home.video.split('watch?v=')
      var embedLink1 = splitLink.join("embed/")
      formData.append('video', embedLink1 + '?showinfo=0&enablejsapi=1&origin=http://localhost:4200');
    }
    if (this.home.precioFinal) {
      formData.append('precioFinal', JSON.stringify(this.home.precioFinal).split('"').join('').split("'").join(''));
    }
    if (this.home.precioAlquiler == null && this.home.condicion == 'Alquiler y venta') {
      this.toastr.info(
        'Si contempla alquilar y vender introduzca el precio de alquiler',
        'Campo requerido'
      );
    }
    if (this.home.precioAlquiler != null && this.home.condicion == 'Alquiler' || this.home.condicion == 'Alquiler y venta') {
      formData.append('precioAlquiler', JSON.stringify(this.home.precioAlquiler).split('"').join('').split("'").join(''));
    }
    //detalles de alquiler
    if (this.fechaDisponibleAlquiler) {
      formData.append('disponibilidad', this.fechaDisponibleAlquiler);
    }
    if (this.home.mascotas) {
      formData.append('mascotas', this.home.mascotas);
    }
    if (this.home.fianza) {
      formData.append('fianza', this.home.fianza);
    }
    if (this.home.estanciaMinima) {
      formData.append('estanciaMinima', this.home.estanciaMinima);
    }
    //detalles para compartir
    if (this.home.precioAlquiler != null && this.home.condicion == 'Compartir') {
      formData.append('precioAlquiler', JSON.stringify(this.home.precioAlquiler).split('"').join('').split("'").join(''));
      formData.append('sepuedeFumar', JSON.stringify(this.home.sepuedeFumar).split('"').join('').split("'").join(''));
      formData.append('seadmitenParejas', JSON.stringify(this.home.seadmitenParejas).split('"').join('').split("'").join(''));
      formData.append('seadmitenMenoresdeedad', JSON.stringify(this.home.seadmitenMenoresdeedad).split('"').join('').split("'").join(''));
      formData.append('seadmitenMochileros', JSON.stringify(this.home.seadmitenMochileros).split('"').join('').split("'").join(''));
      formData.append('seadmitenJubilados', JSON.stringify(this.home.seadmitenJubilados).split('"').join('').split("'").join(''));
      formData.append('seadmiteLGTBI', JSON.stringify(this.home.seadmiteLGTBI).split('"').join('').split("'").join(''));
      formData.append('propietarioviveEnlacasa', JSON.stringify(this.home.propietarioviveEnlacasa).split('"').join('').split("'").join(''));
      if (this.home.perfilCompartir) {
        formData.append('perfilCompartir', this.home.perfilCompartir);
      }
      if (this.home.habitantesActualmente) {
        formData.append('habitantesActualmente', this.home.habitantesActualmente);
      }
      if (this.home.ambiente) {
        formData.append('ambiente', this.home.ambiente);
      }
      if (this.home.gastos) {
        formData.append('gastos', this.home.gastos);
      }
    }
    if (this.user.isPro) {
      if (this.user.color != null || this.user.color != undefined) {
        this.home.proColor = this.user.color;
      }
      if (this.user.brandImage != null || this.user.brandImage != undefined || this.user.brandImage.imageUrl.length != 0) {
        this.home.proImage = this.user.brandImage.imageUrl;
      }
    }
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i]) {
          const body = new FormData();
          body.append('image', this.selectedFiles[i]);
          this.subscriptions.push(Axios.post(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${this.selectedFiles[i].name}`, body).subscribe({
            next: (res: any) => {
              console.log(res);
              this.images[i] = {
                imageId: res.data.data.id,
                imageName: res.data.data.title,
                imageUrl: res.data.data.url,
                imageDeleteUrl: res.data.data.delete_url
              };
              const msg = 'Subida correctamente: ' + this.selectedFiles[i].name;
              this.message.push(msg);
              this.filesUploadSuccessfully = i;
              console.log('subidas: ' + this.filesUploadSuccessfully + ' cantidad: ' + this.selectedFiles.length);
              if ((this.selectedFiles.length - 1) == this.filesUploadSuccessfully) {
                setTimeout(() => {
                  formData.append('imagesAsString', JSON.stringify(this.images));
                  var obj = {};
                  formData.forEach((value, key) => obj[key] = value);
                  var json = JSON.stringify(obj);
                  console.log(json);
                  this.subscriptions.push(
                    this.homeService.addHome(json).subscribe(() => {
                      this.router.navigate(['/home']),
                        this.notificationService.notify(NotificationType.SUCCESS, `Anuncio creado.`);
                      var resetForm = <HTMLFormElement>document.getElementById('newMarkerForm');
                      resetForm?.reset();
                      $(".modal").removeClass("is-active");
                    })
                  );
                }, 3000);
              }
            },
            error: (err: any) => {
              const msg = 'Error al procesar la imagen: ' + this.selectedFiles[i].name + ' error: ' + err;
              this.message.push(msg);
            }
          }));
        }
      }
    }

    this.map.removeLayer(this.lg);
    /*setTimeout(()=>{
      window.location.reload();
    },5000);*/
  }

  checkBox(param): any {
    console.log(param);
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
    if (flag == 'condicion' && value == '0') {
      this.filterRentSalePriceFlag = 'Alquiler'
      $(".ant-select-clear").trigger('click');
    } else if (flag == 'condicion' && value == '1') {
      this.filterRentSalePriceFlag = 'Venta'
      $(".ant-select-clear").trigger('click');
    } else if (flag == 'condicion' && value == '2') {
      this.filterRentSalePriceFlag = 'Compartir'
      $(".ant-select-clear").trigger('click');
    }
    /*
    * responde a los eventos del multiselect
    */
    if (this.myMap.has(flag) && flag != 'tipo' && value != null) { // contiene el elemento
      this.myMap.delete(flag);
      this.clearPrices(flag);
      this.myMap.set(flag, value);
      this.searchFilterItems(this.myMap);
    } else if (!this.myMap.has(flag) && flag != 'tipo' && value != null) { // no contiene el elemento
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
            var formatParam = value.replace('€', '').split(',').join(''); // me dejas un número entero
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioAlquiler>=' + formatParam + ',') // lo pone sequido a sorts
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioAlquiler>=' + formatParam + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'precioAlquilerMax') {
            var formatParam = value.replace('€', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioAlquiler<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioAlquiler<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'precioVentaMin') {
            var formatParam = value.replace('€', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioFinal>=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioFinal>=' + formatParam + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'precioVentaMax') {
            var formatParam = value.replace('€', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioFinal<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioFinal<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'superficieMin') {
            var formatParam = value.replace('m²', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'superficie>=' + formatParam + ',')
            urlFilterRequest = formatUrl; // ordenamiento 
            urlFilterRequest = 'superficie>=' + formatParam + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key == 'superficieMax') {
            var formatParam = value.replace('m²', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'superficie<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'superficie<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          }
        }
      } else if (key == 'habitaciones' || key == 'aseos' || key == 'aseoEnsuite' || key == 'garage') {
        if (value != String(5)) {
          urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        } else {
          urlFilterRequest = key + '>=' + value + ',' + urlFilterRequest;
        }
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (String(value) == 'true') {
        if (key == 'trastero' || key == 'piscinaComp') {
          if (urlFilterRequest.includes('model@=*,')) {
            urlFilterRequest = urlFilterRequest.split('model@=*,').join('model@=*Flat,');
          } else if (!urlFilterRequest.includes('model@=*')) {
            urlFilterRequest = 'model@=*Flat,' + urlFilterRequest;
          }
        } else if (key == 'panelesSolares' || key == 'inmuebleAccesible' || key == 'jacuzzi') {
          if (urlFilterRequest.includes('model@=*,')) {
            urlFilterRequest = urlFilterRequest.split('model@=*,').join('model@=*Flat,');
          } else if (!urlFilterRequest.includes('model@=*')) {
            urlFilterRequest = 'model@=*Flat,' + urlFilterRequest;
          }
        }
        urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
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
        } else if ('model@=*House,') {
          urlFilterRequest = urlFilterRequest.split('model@=*House,').join('');
        } else if ('model@=*Flat|House,') {
          urlFilterRequest = urlFilterRequest.split('model@=*Flat|House,').join('');
        } else if ('model@=*House|Flat,') {
          urlFilterRequest = urlFilterRequest.split('model@=*House|Flat,').join('');
        }
        urlFilterRequest = 'model' + '@=*' + modelOptions + ',' + 'tipo' + '@=*' + tipoValues + ',' + urlFilterRequest
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'descripcion') {
        var formatParam = value.split(' ').join('|');
        if (formatParam.slice(-1) == "|") {
          formatParam = formatParam.slice(0, -1);
        }
        urlFilterRequest = 'descripcion' + '@=*' + formatParam + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'estado') {
        urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]))
      } else if (key == 'ciudad') { // descarte: ciudad
        urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]))
      } else if (key == 'condicion') {
        if (value == '0') {
          urlFilterRequest = key + '@=*' + 'Alquiler' + ',' + urlFilterRequest;
        } else if (value == '1') {
          urlFilterRequest = key + '@=*' + 'Venta' + ',' + urlFilterRequest;
        } else if (value == '2') {
          urlFilterRequest = key + '@=*' + 'Compartir' + ',' + urlFilterRequest;
        }
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key == 'vistasDespejadas') {
        if (urlFilterRequest.includes('model@=*,')) {
          urlFilterRequest = urlFilterRequest.split('model@=*,').join('model@=*Flat,');
        } else if (!urlFilterRequest.includes('model@=*')) {
          urlFilterRequest = 'model@=*Flat,' + urlFilterRequest;
        }
        urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      }
    });
    if (urlFilterRequest.includes('model@=*,')) {
      urlFilterRequest = urlFilterRequest.split('model@=*,').join('');
    }
    console.log(urlFilterRequest);
    this.loadMarkers(urlFilterRequest);
  }

  public clearMap() {
    this.myMap = new Map<string, string>(JSON.parse(localStorage.getItem("detailFiltersMap")));
    this.myMap.clear();
    this.myMap.set('condicion', '1');
    localStorage.setItem('detailFiltersMap', JSON.stringify([...this.myMap]));
    this.wordCount = 0;
    this.homeFiltersRequest.keywords = '';
    this.loadMarkers('condicion@=*' + this.mapRentSalePriceFlag);
  }

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
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
