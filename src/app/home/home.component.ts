import {
  PropertyType, HouseType, Bedrooms, Bathrooms, Badge, PropertyState, Enseñanza, Institucion,
  RamasConocimiento, EmisionesCO2, ConsumoEnergetico, TipoDeVia, Orientacion, Provincias, PrecioMinimoAlquiler,
  PrecioMaximoAlquiler, PrecioMinimoVenta, PrecioMaximoVenta, Superficie, Views
} from './../class/property-type.enum';
import { UserService } from './../service/user.service';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, Optional, Output, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
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
import { HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as L from 'leaflet';
//import H from '@here/maps-api-for-javascript';
import { HomeService } from '../service/home.service';
import { Aeropuerto, Beach, Bus, Home, Metro, Supermercado, Universidad, HomeImage, Colegio, HomeFilterRequest } from '../model/home';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenStreetMapProvider, GeoSearchControl, SearchControl, } from 'leaflet-geosearch';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import { APIKEY } from 'src/environments/environment.prod';
import * as $ from 'jquery';
import Axios from 'axios-observable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
  ) {
    super(router, authenticationService, userService, notificationService, route, toastr);
  }

  map!: L.map; // map allocates homes
  map2!: L.Map; // map geocoding search location
  map3!: L.Map; // map to set nearly services
  //hereMap!: H.Map;
  lg = new L.LayerGroup();
  mp!: L.Marker;
  markerHouse!: L.Marker; // punto de referencia para los servicios
  markerSchool!: L.Marker;
  fg = L.featureGroup(); // template for services
  popup = L.popup();
  beforeCoords!: L.LatLng; // app user coordinates at the beggining
  afterCoords!: L.LatLng; // coordinates where the user wants to put his house
  nextCoords!: L.LatLng; // temp coordinates to put any service
  streetView!: L.LatLng;

  home: Home = new Home();
  homeFiltersRequest: HomeFilterRequest = new HomeFilterRequest();
  homes: Home[] = [];
  state: boolean = this.authenticationService.isUserLoggedIn();
  opt = {};
  mydate = new Date().getTime();
  condicion: string[] = Object.values(PropertyType);
  tipo: string[] = Object.values(HouseType);
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
  vistas: string[] = Object.values(Views);
  currentPopupOpenId: string;
  images = new Array<HomeImage>();// new Array(30).fill('');
  routerLinkId: number = 0;
  routerLinkModel: string;
  filterRentSalePriceFlag: string = 'Venta';
  mapRentSalePriceFlag: string = 'Venta';
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

  mobilityMenu: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.mobilityMenu = window.innerWidth;
  }

  @ViewChild('newMarkerForm') newMarkerForm: FormGroupDirective;
  // show/hide 2nd modal
  @ViewChild('element') element: ElementRef;
  @ViewChild('map_3') map_3?: ElementRef;
  openToogleModal(flag: boolean) {
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
  setRoute(
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
          }).bindPopup(
            `
            <div class="col">
            <button type="button" class="popupopen btn btn-secondary" onclick="saveService()">Guardar</button>
            </div>
            `
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
    let timer = setTimeout(() => {
      this.map3.invalidateSize();
    }, 300);
  }

  // modal antdsgn
  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    if (!this.isVisible) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }
  //modal primeng
  mainModal: boolean = false;
  showDialog() {
    this.mainModal = true;
  }
  closeDialog() {
    this.mainModal = false;
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

  handleCancel(): void {
    this.isVisible = false;
  }

  showCityResult() {
    if (this.home.ciudad == null) {
      alert('Introduzca la provincia!');
    } else {
      var x = document.getElementById('provButton2');
      x.style.display = 'none';
      x = document.getElementById('map_2');
      x.style.display = 'none';
      x = document.getElementById('provButton');
      x.style.display = 'block';
      this.map2.remove();
      this.home.ciudad = this.home.ciudad.split(' ')[0].replace(',', '');
      x.innerHTML = this.home.ciudad;
      console.log(this.home.ciudad);
    }
  }

  locationMap() {
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
    var x = document.getElementById('provButton');
    x.style.display = 'none';
    var x = document.getElementById('provButton2');
    x.style.display = 'block';
  }

  public loadMarkers() {
    this.map = L.map('map', { renderer: L.canvas() }).setView(
      [39.46975, -0.37739],
      17  //25
    );
    this.getLocation();
    //tileLayerSelect().addTo(map);
    //tileLayerWMSSelect().addTo(map);
    //tileLayerCP().addTo(map); // Codigos postales
    //tileLayerWMSSelectIGN().addTo(this.map);
    Stadia_OSMBright().addTo(this.map);
    //tileLayerHere().addTo(this.map);

    this.subscriptions.push(
      this.homeService.getHomes().subscribe((data) => {
        data.map((Home) => {
          Home.images = JSON.parse(Home.imagesAsString)
          marker(
            [Number(Home.lat), Number(Home.lng)],
            {
              icon: new L.DivIcon({
                className: 'custom-div-icon',
                html: `<div class="property-pill streamlined-marker-container streamlined-marker-position pill-color-forsale with-icon"
                          role="link"
                          tabindex="-1"
                          data-test="property-marker">
                          <div class="icon-text" style="display: inline-block; overflow: hidden;">${this.formatNumberWithCommas(Home.precioFinal)}€</div>
                      </div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42]
              })
            },
            this.opt
          )
            .bindPopup(
              `
            <div class="reale1 row">
              <div class="reale2" col-sm-6>
                 <div class="reale3" >
                    <div class="reale5">
                       <div id="carouselExample" class="carousel slide ">
                          <div class="carousel-inner" >
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
                    </div>
                    <div class="col-sm-6 realeTextContainer">
                       <div class="realeTextContainer_2">
                          <p class="p_1">${Home.tipo} en ${Home.condicion}</p>
                              <input type="checkbox" id="cuore" onclick="cuoreLike()"/>
                              <label for="cuore" style="float:right;">
                                  <svg  id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                                      <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                                          <path d="M28.9955034,43.5021565 C29.8865435,42.7463028 34.7699838,39.4111958 36.0304386,38.4371087 C41.2235681,34.4238265 43.9999258,30.3756814 44.000204,25.32827 C43.8745444,20.7084503 40.2276972,17 35.8181279,17 C33.3361339,17 31.0635318,18.1584833 29.5323721,20.1689268 L28.9999629,20.8679909 L28.4675537,20.1689268 C26.936394,18.1584833 24.6637919,17 22.181798,17 C17.6391714,17 14,20.7006448 14,25.3078158 C14,30.4281078 16.7994653,34.5060727 22.0294634,38.5288772 C23.3319753,39.530742 27.9546492,42.6675894 28.9955034,43.5021565 Z" id="heart" stroke="#fc2779"/>
                                          <circle id="main-circ" fill="#fc2779" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

                                          <g class="grp" id="grp7" opacity="0" transform="translate(7 6)">
                                              <circle class="cir-a" id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                                              <circle  class="cir-b " id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                                          </g>

                                          <g class="grp" id="grp6" opacity="0" transform="translate(0 28)">
                                              <circle class="cir-a" id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                                              <circle class="cir-b" id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                                          </g>

                                          <g class="grp" id="grp3" opacity="0" transform="translate(52 28)">
                                              <circle class="cir-b" id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                                              <circle class="cir-a" id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                                          </g>

                                          <g class="grp" id="grp2" opacity="0" transform="translate(44 6)">
                                              <circle class="cir-b" id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                                              <circle class="cir-a" id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                                          </g>

                                          <g class="grp" id="grp5" opacity="0" transform="translate(14 50)">
                                              <circle class="cir-a" id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                                              <circle  class="cir-b" id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                                          </g>

                                          <g class="grp" id="grp4" opacity="0" transform="translate(35 50)">
                                              <circle  class="cir-a" id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                                              <circle class="cir-b" id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                                          </g>

                                          <g class="grp" id="grp1" opacity="0" transform="translate(24)">
                                              <circle class="cir-a" id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                                              <circle class="cir-b" id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                                          </g>
                                      </g>
                                  </svg>
                              </label>
                          <p class="p_2">${this.formatNumberWithCommas(Home.precioFinal)}€</p>
                          <a onclick="runPopup()" class="a_1">
                             <p class="p_3">${Home.tipoDeVia} ${Home.calle} ${Home.numero},</p>
                             <p class="p_4">${Home.ciudad}</p>
                          </a>
                          <div class="ul_features">
                                <ion-icon style="font-size: 16px; top:-3px; position:relative;" src="assets/svg/bath_tub.svg"></ion-icon>
                                ${Home.aseos}&nbsp;&nbsp;
                                <ion-icon style="font-size: 16px; color:#666;" name="bed-outline"></ion-icon>
                                ${Home.habitaciones}&nbsp;&nbsp;
                                <ion-icon style="font-size: 16px; color:#666;" name="car-outline"></ion-icon>
                                ${Home.garage}&nbsp;&nbsp;
                                <ion-icon style="font-size: 12px; color:#666;" src="assets/svg/size_arrow.svg"></ion-icon>
                                &nbsp;${Home.superficie + "m²"}
                          </div>
                       </div>
                    </div>
                 </div>
                 
              </div>
              
           </div>
           
            `,
              {
                maxWidth: 382,
                maxHeight: 152,
                /*removable: true,
                editable: true,*/
                /*direction: 'top',*/
                permanent: false,
                /*sticky: false,*/
                offset: [6, -63],
                opacity: 0,
                className: 'popupX',
              }
            )
            .on(
              'click',
              () => (
                localStorage.removeItem('currentBuilding'),
                localStorage.setItem('currentBuilding', JSON.stringify(Home)),
                this.dynamicCarousel(Home.images)
              )
            ).on('popupopen', () => {
              this.routerLinkId = +Home.id;
              this.routerLinkModel = Home.model;
              if (this.state) {
                if (this.user.likePreferences != undefined && this.user.likePreferences != null) {
                  if (this.user.likePreferences.includes(Home.viviendaId)) {
                    this.clickButton('cuore');
                  }
                }
              }
            })/*.on('mouseover',()=>{
              this.dynamicCarousel(Home.images);
            })*/
            .addTo(this.map);
        });
        this.homes = data;
      })
    );
  }

  /************************************************************/
  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.userMarkerEvents();
    this.loadMarkers();
    this.loadScripts();
    this.mobilityMenu = window.innerWidth;
  }

  dynamicCarousel(data: HomeImage[]) {
    setTimeout(() => {
      for(let j = 0; j < data.length; j++) {
        $('<div class="carousel-item"><img src="'+data[j].imageUrl+'"class="image-container"></div>').appendTo('.carousel-inner');
      }
        $('.carousel-item').first().addClass('active');
    }, 200);
  }

  cuoreLikeFeature() {
    if (this.state) {
      if (this.user.likePreferences.includes(this.currentPopupOpenId)) {
        this.clickButton('cuore');
        this.user.likePreferences.filter((like) => like !== this.currentPopupOpenId);
      } else {
        this.user.likePreferences.push(this.currentPopupOpenId);
      }
    } else {

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
      this.map.setView(this.beforeCoords, 25); // poner el foco en el mapa
      this.map.fitBounds([[this.beforeCoords.lat, this.beforeCoords.lng]]); // por si acaso..
    });
    this.map.on('locationerror', this.notFoundLocation); // si el usuario no activa la geolocalización
    this.map.locate({ setView: true, maxZoom: 25 }); // llamada para que la geolocalización funcione
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
    this.notificationService.notify(
      NotificationType.INFO,
      'Mueve el marcador hasta su propiedad'
    );
    /*this.toastr.success(
      'Arrastra el marcador!',
      'Mueve el marcador hasta su propiedad!'
    );*/
    this.mp = new L.marker(this.beforeCoords, {
      draggable: true,
      icon: luxuryRed,
    }).bindPopup(`
      
      <button type="button" class="button is-primary is-rounded" onclick="runModal()" >Hecho</button>
      
      `);
    this.lg = new L.LayerGroup([this.mp]);
    this.lg.addTo(this.map);

    /*const popupItem=L.popup().setLatLng(this.beforeCoords)
      .setContent('<h5>Arrastrame a una ubicación exacta</h5>')
      .openOn(this.mp);*/
    this.mp.on('move', () => (this.afterCoords = this.mp.getLatLng()));
    this.mp.on('moveend', () => console.log(this.afterCoords));
    this.mp.on('dragend', () => this.mp.openPopup());
    this.map.flyTo([this.beforeCoords.lat, this.beforeCoords.lng], 20);
  }

  // Revisar - en el html -> oninput="textAreaResize(this)"
  textAreaResize(e) {
    e.style.height = '5px';
    e.style.height = e.scrollHeight + 'px';
  }

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

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  filesUploadSuccessfully: number = 0;

  newHome() {
    this.lg.remove(this.mp);
    /*
    * por ahora al tener anidados varios elementos y componentes de distintas librerías los validators
    * no cogen por lo que se hace manual para lo esencial y luego el usuario si lo quiere editar que
    * ponga los atributos adicionales. Aun así están definidos los form-group + form-outline 
    */
    if (this.home.ciudad == null || this.home.ciudad == undefined) {
      this.toastr.info(
        'Introduzca la ciudad',
        'Campo requerido'
      );
    } else if (this.home.tipoDeVia == null || this.home.tipoDeVia == undefined) {
      this.toastr.info(
        'Introduzca el tipo de vía',
        'Campo requerido'
      );
    } else if (this.home.calle == null || this.home.calle == undefined) {
      this.toastr.info(
        'Introduzca la calle',
        'Campo requerido'
      );
    } else if (this.home.distrito == null || this.home.distrito == undefined) {
      this.toastr.info(
        'Distrito no encontrado',
        'Campo requerido'
      );
    } else if (this.home.cp == null || this.home.cp == undefined) {
      this.toastr.info(
        'Código postal incorrecto',
        'Campo requerido'
      );
    } else if (this.home.antiguedad == null || this.home.antiguedad == undefined) {
      this.toastr.info(
        'Falta la antiguedad',
        'Campo requerido'
      );
    } else if (this.home.superficie == null || this.home.superficie == undefined) {
      this.toastr.info(
        'Superficie indeterminada',
        'Campo requerido'
      );
    } else if (this.home.habitaciones == null || this.home.habitaciones == undefined) {
      this.toastr.info(
        'Introduzca las habitaciones. Si se trata de un estudio/loft marque 0.',
        'Campo requerido'
      );
    } else if (this.home.aseos == null || this.home.aseos == undefined) {
      this.toastr.info(
        'Introduzca de cuantos aseos dispone la vivienda',
        'Campo requerido'
      );
    } else if (this.home.condicion == null || this.home.condicion == undefined) {
      this.toastr.info(
        'Introduzca si se encuentra en alquiler, venta o ambas cosas',
        'Campo requerido'
      );
    } else if (this.home.tipo == null || this.home.tipo == undefined) {
      this.toastr.info(
        'Tipo de vivienda obligatorio',
        'Campo requerido'
      );
    } else if (this.home.orientacion == null || this.home.orientacion == undefined) {
      this.toastr.info(
        'Introduzca la orientación',
        'Campo requerido'
      );
    } else if (this.home.estado == null || this.home.estado == undefined) {
      this.toastr.info(
        'Introduzca el estado en el que se encuentra la vivienda',
        'Campo requerido'
      );
    } else if (this.home.precioFinal == null || this.home.precioFinal == undefined
      && this.home.condicion == "Venta" || this.home.condicion == "Alquiler y venta") {
      this.toastr.info(
        'Introduzca el precio de venta',
        'Campo requerido'
      );
    } else if (this.home.precioAlquiler == null || this.home.precioAlquiler == undefined) {
      if (this.home.condicion == "Alquiler" || this.home.condicion == "Alquiler y venta") {
        this.toastr.info(
          'Introduzca el precio de alquiler',
          'Campo requerido'
        );
      }
    } else if (this.home.vistasDespejadas == null || this.home.vistasDespejadas == undefined) {
      this.toastr.info(
        'Introduzca las vistas que ofrece la vivienda',
        'Campo requerido'
      );
    } else if (this.home.descripcion == null || this.home.descripcion == undefined) {
      this.toastr.info(
        'Introduzca una descripción detallada',
        'Campo requerido'
      );
    }
    const formData = new FormData();
    formData.append('lat', this.afterCoords.lat);
    formData.append('lng', this.afterCoords.lng);
    formData.append('ciudad', this.home.ciudad);
    formData.append('calle', this.home.calle);
    formData.append('numero', this.home.numero);
    formData.append('cp', this.home.cp);
    formData.append('superficie', JSON.stringify(this.home.superficie).split('"').join('').split("'").join(''));
    formData.append('garage', JSON.stringify(this.home.garage).split('"').join('').split("'").join(''));
    formData.append('condicion', this.home.condicion);
    formData.append('tipo', this.home.tipo);
    formData.append('piso', this.home.piso);
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
    formData.append('plantaMasAlta', JSON.stringify(this.home.plantaMasAlta));
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
    if (this.home.aseoEnsuite) {
      formData.append('aseoEnsuite', JSON.stringify(this.home.aseoEnsuite).split('"').join('').split("'").join(''));
    }
    if (this.home.video != null) {
      var splitLink = this.home.video.split('watch?v=')
      var embedLink1 = splitLink.join("embed/")
      formData.append('video', embedLink1 + '?showinfo=0&enablejsapi=1&origin=http://localhost:4200');
    }
    if (this.home.precioFinal != null) {
      formData.append('precioFinal', JSON.stringify(this.home.precioFinal).split('"').join('').split("'").join(''));
    }
    if (this.home.precioAlquiler != null && this.home.condicion == 'Alquiler') {
      formData.append('precioAlquiler', JSON.stringify(this.home.precioAlquiler).split('"').join('').split("'").join(''));
    }
    if (this.home.precioAlquiler != null && this.home.condicion == 'Alquiler y venta') {
      this.toastr.info(
        'Si contempla alquilar y vender introduzca el precio de alquiler',
        'Campo requerido'
      );
    }
    if (this.home.precioAlquiler != null && this.home.condicion == 'Compartir') {
      this.toastr.info(
        'Si contempla compartir y vender introduzca el precio de alquiler',
        'Campo requerido'
      );
    }
    if (this.fechaDisponibleAlquiler) {
      formData.append('disponibilidad', this.fechaDisponibleAlquiler);
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
                        this.sendNotification(NotificationType.SUCCESS, `Anuncio creado.`);
                      var resetForm = <HTMLFormElement>document.getElementById('newMarkerForm');
                      resetForm.reset();
                      this.clickButton('new-marker-close');
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
  }

  checkBox(param): any {
    console.log(param);
  }
  /* Filters
  *
  *
  * 
  * 
  * 
  */
  myMap: any;
  modalRef: BsModalRef;
  openFiltersModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // , {class: 'modal-lg'}
    this.myMap = new Map<string, string>();
    if ('detailFiltersMap' in localStorage) {
      localStorage.removeItem('detailFiltersMap');
      localStorage.setItem('detailFiltersMap', JSON.stringify([...this.myMap]));
    } else {
      localStorage.setItem('detailFiltersMap', JSON.stringify([...this.myMap]));
    }
  }

  public filter(value: any, flag: string) {
    // mapa para hacer la peticion
    this.myMap = new Map<string, string>(JSON.parse(localStorage.getItem("detailFiltersMap")));
    localStorage.removeItem('detailFiltersMap');
    // variable para mostrar los select de alquiler/compartir o venta
    if (flag === 'condicion' && value === 'Alquiler') {
      this.filterRentSalePriceFlag = 'Alquiler'
    } else if (flag === 'condicion' && value === 'Venta') {
      this.filterRentSalePriceFlag = 'Venta'
    } else if (flag === 'condicion' && value === 'Compartir') {
      this.filterRentSalePriceFlag = 'Compartir'
    }
    /*
    *
    *
    */
    if (this.myMap.has(flag) && flag != 'tipo') { // contiene el elemento
      this.myMap.delete(flag);
      this.clearPrices(flag);
      this.myMap.set(flag, value);
      this.searchFilterItems(this.myMap);
    } else if (!this.myMap.has(flag) && flag != 'tipo') { // no contiene el elemento
      this.clearPrices(flag);
      this.myMap.set(flag, value);
      this.searchFilterItems(this.myMap);
    } else if (flag === 'tipo') { // tipo
      if (this.myMap.has(flag)) {
        this.myMap.delete(flag);
      }
      var homeTypes = JSON.stringify(value);
      this.myMap.set(flag, homeTypes);
      this.searchFilterItems(this.myMap);
    }
    console.log(flag + ' : ' + value);
  }

  /**
   * Si el usuario cambia de precio de alquiler a precio de venta o viceversa
   * esta función borra los 2 parámetros de filtrado anteriores
   * ***/
  public clearPrices(flag: string) {
    if (flag === 'precioAlquilerMin' || flag === 'precioAlquilerMax') {
      if (this.myMap.has('precioVentaMin')) {
        this.myMap.delete('precioVentaMin');
      }
      if (this.myMap.has('precioVentaMax')) {
        this.myMap.delete('precioVentaMax');
      }
    }
    if (flag === 'precioVentaMin' || flag === 'precioVentaMax') {
      if (this.myMap.has('precioAlquilerMin')) {
        this.myMap.delete('precioAlquilerMin');
      }
      if (this.myMap.has('precioAlquilerMax')) {
        this.myMap.delete('precioAlquilerMax');
      }
    }
  }
  /* itera el mapa, crea un string con la url y hace la petición
  *  1 - filtros genéricos (true-false...) ok
  *  2 - filtros de características (ciudad,estado...) ok 
  *  3 - ordenamiento y filtrado (precio y superficie) ok
  *  4 - página y tamaño de la página (proximamente, cuando me vaya al componente list
  *       y haga en este una tab para el listado)
  *  5 - array de objetos (tipo) con operadores lógicos ok
  *  6 - cantidad 1-5=< ok
  * 
  */
  public searchFilterItems(map: Map<string, string>) {
    var urlFilterRequest = '&sorts=';
    map.forEach((value: string, key: string) => {
      if (key === 'precioAlquilerMin' || key === 'precioAlquilerMax' || key === 'precioVentaMin' || key === 'precioVentaMax'
        || key === 'superficieMin' || key === 'superficieMax') {
        if (urlFilterRequest.includes('&sorts=')) {
          if (key === 'precioAlquilerMin') {
            var formatParam = value.replace('€', '').split(',').join(''); // me dejas un número entero
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + formatParam + '<=precioAlquiler' + ',') // lo pone sequido a sorts
            urlFilterRequest = formatUrl;
            urlFilterRequest = formatParam + '<=precioAlquiler' + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key === 'precioAlquilerMax') {
            var formatParam = value.replace('€', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioAlquiler<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioAlquiler<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key === 'precioVentaMin') {
            var formatParam = value.replace('€', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + formatParam + '<=precioFinal' + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = formatParam + '<=precioFinal' + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key === 'precioVentaMax') {
            var formatParam = value.replace('€', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'precioFinal<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'precioFinal<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key === 'superficieMin') {
            var formatParam = value.replace('m²', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + formatParam + '<=superficie' + ',')
            urlFilterRequest = formatUrl; // ordenamiento 
            urlFilterRequest = formatParam + '<=superficie' + ',' + urlFilterRequest; // filtrado
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          } else if (key === 'superficieMax') {
            var formatParam = value.replace('m²', '').split(',').join('');
            var formatUrl = urlFilterRequest.split('&sorts=').join('&sorts=' + 'superficie<=' + formatParam + ',')
            urlFilterRequest = formatUrl;
            urlFilterRequest = 'superficie<=' + formatParam + ',' + urlFilterRequest;
            localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
          }
        }
      } else if (key === 'habitaciones' || key === 'aseos' || key === 'aseoEnsuite' || key === 'garage') {
        if (value != String(5)) {
          urlFilterRequest = key + '==*' + value + ',' + urlFilterRequest;
        } else {
          urlFilterRequest = key + '>=*' + value + ',' + urlFilterRequest;
        }
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (String(value) === 'true' || String(value) === 'false') {
        urlFilterRequest = key + '==' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else if (key === 'tipo') {
        var obj = JSON.parse(value);
        var tipoValues = '';
        for (var item of obj) {
          tipoValues += item.value + '|'
        }
        if (tipoValues.slice(-1) == "|") {
          tipoValues = tipoValues.slice(0, -1);
        }
        urlFilterRequest = 'tipo' + '@=*' + tipoValues + ',' + urlFilterRequest
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      } else { // descarte: condicion, ciudad, estado y vistas. Falta cuadrar esto
        // con los atributos de compartir 
        console.log(key + ' ' + value + 'descarte');
        urlFilterRequest = key + '@=*' + value + ',' + urlFilterRequest;
        localStorage.setItem('detailFiltersMap', JSON.stringify([...map]));
      }
    });
    this.homeService.getHomesByQuery(urlFilterRequest);
    console.log(urlFilterRequest);
  }

  public clearMap() {
    this.myMap = new Map<string, string>(JSON.parse(localStorage.getItem("detailFiltersMap")));
    this.myMap.clear();
    localStorage.setItem('detailFiltersMap', JSON.stringify([...this.myMap]));
  }

  applyCaptureNameFilter() {
    console.log();
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
