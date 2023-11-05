import { PropertyType, HouseType, Bedrooms, Bathrooms, Badge, PropertyState, Enseñanza, Institucion, 
  RamasConocimiento, EmisionesCO2, ConsumoEnergetico, 
} from './../class/property-type.enum';
import { UserService } from './../service/user.service';
import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { marker, LatLng, circleMarker } from 'leaflet';
import 'leaflet.locatecontrol';
import { tileLayerSelect, tileLayerCP, tileLayerWMSSelect, tileLayerHere, tileLayerWMSSelectIGN, tileLayerTransportes, 
  Stadia_OSMBright, OpenStreetMap_Mapnik, CartoDB_Voyager, Thunderforest_OpenCycleMap, Jawg_Sunny} from '../model/maps/functions';
import { grayIcon, greenIcon, grayPointerIcon, blackMarker, homeicon, beachIcon, airportIcon, marketIcon, subwayIcon,
  busIcon, schoolIcon, universityIcon, fancyGreen, } from '../model/maps/icons';
import { UserComponent } from '../components/user/user.component';
import { NotificationService } from '../service/notification.service';
import { AuthenticationService } from '../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from '../class/notification-type.enum';
import { HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as L from 'leaflet';
//import H from '@here/maps-api-for-javascript';
import { HomeService } from '../service/home.service';
import { Aeropuerto, Beach, Bus, Home, Metro, Supermercado, Universidad, HomeImage,} from '../model/home';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenStreetMapProvider, GeoSearchControl, SearchControl, } from 'leaflet-geosearch';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { Colegio } from '../model/home';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import 'leaflet.awesome-markers';
import { APIKEY } from 'src/environments/environment.prod';
import * as $ from 'jquery';
import Axios from 'axios-observable';

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

  images=new Array<HomeImage>();// new Array(30).fill('');

  // method must know what array needs to work
  serviceGoal: string; // aim service
  indexGoal: number; // array index
  buttonBefore: string; // button calls to save
  buttonAfter: string; // show route
  buttonDelete: string; // invert buttons load save
  row: number; // index save load matrix
  col: number;

  // to set nearly services
  //<div class="accordion-item" *ngIf="isEmptyArray(this.colegios)">

  colegio:Colegio[]=[
    {lat:'',lng:'',nombre:'',ensenyanza:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',ensenyanza:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',ensenyanza:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',ensenyanza:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',ensenyanza:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',ensenyanza:'',institucion:'',web:'',distancia:'',tiempo:'',},
];

  universidad:Universidad[]=[
    {lat:'',lng:'',nombre:'',rama:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',rama:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',rama:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',rama:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',rama:'',institucion:'',web:'',distancia:'',tiempo:'',},
    {lat:'',lng:'',nombre:'',rama:'',institucion:'',web:'',distancia:'',tiempo:'',},
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

  @ViewChild('openselect') openselect: ElementRef;
  showSelect() {
    this.openselect.nativeElement.classList.toggle('active');
  }

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
        //tileLayerHere().addTo(this.map3);
        //OpenStreetMap_Mapnik().addTo(this.map3);
        //CartoDB_Voyager().addTo(this.map3);
        //Thunderforest_OpenCycleMap().addTo(this.map3);
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
    /*auxMarker: L.Marker([this.nextCoords.lat,this.nextCoords.lng],{icon:this.customIcon, draggable:false});
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

  reRackService( row: number, col: number, btnBeforeId: string, btnAfterId: string, btnDltId: string) {
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
    this.isVisible = true;
  }

  // tamaño de los select para las tablas de proximidades
  size: NzSelectSizeType = 'small';

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



  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
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

  /************************************************************/
  ngOnInit(): void {    
    this.user=this.authenticationService.getUserFromLocalCache();
    this.userMarkerEvents();
    this.map = L.map('map', { renderer: L.canvas() }).setView(
      [39.46975, -0.37739],
      25
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
          Home.images=JSON.parse(Home.imagesAsString)
          marker(
            [Number(Home.lat), Number(Home.lng)],
            { icon: fancyGreen },
            this.opt
          )
            .bindTooltip(
              `
            <div class="row" id="slider" style="position:relative;">
              <div class="col-sm-6" style="position:relative;">
                <div>
                  <h6 style="align-items:center;">Calle ${Home.calle}</h6>    
                </div>
                <div>
                </div>
                <div>
                  <ion-icon style="font-size: 16px;" src="assets/svg/bath_tub.svg"></ion-icon>${Home.aseos}
                  <ion-icon style="font-size: 16px; color:#666;" name="bed-outline"></ion-icon>${Home.habitaciones}
                  <ion-icon style="font-size: 16px; color:#666;" name="car-outline"></ion-icon>${Home.garage}
                  <ion-icon style="font-size: 16px; color:#666;" src="assets/svg/house_size.svg"></ion-icon>${Home.superficie + "m²"}
                </div>
              </div>
                <div class="slides col-sm-6" style="position:relative;">
                  <img class="" style="border-radius: 0 10px 10px 0; width:220px; height:151px; display:block; top:-7px; right:-17px; position:relative;" src=${Home.images[0].imageUrl}>
              </div>
            </div>
            `,
              {
                maxWidth: 150,
                maxHeight: 80,
                removable: true,
                editable: true,
                direction: 'top',
                permanent: false,
                sticky: false,
                offset: [0, -45],
                opacity: 5,
                className: 'tooltipX',
              }
            ) 
            .on(
              'click',
              () => (
                localStorage.removeItem('currentBuilding'),
                localStorage.setItem('currentBuilding', JSON.stringify(Home)),
                this.router.navigate(['/add'])
              )
            )
            .addTo(this.map);
        });
        this.homes=data;
      })
    );

    //            <button type="button" class="btn btn-secondary" data-toggle="modal" onclick="${this.viewAdd(Edificio.edificioId)}">Ver</button>

    /*  fitbounds para centrar el foco en los marcadores
    const markerItem = marker([39.46975, -0.37739]) // marker de prueba. Los usuarios podrán crear sus markers
      .addTo(map)
      .bindPopup('Marker de prueba');
    map.fitBounds([[markerItem.getLatLng().lat, markerItem.getLatLng().lng]]); //centramos la camara en la ubicación del marcador
  */

    //L.Control.Zoom({ position: 'topright' }).addTo(this.map);
    //
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
    // hay que recorrer layergroup para borrarlo si existe y que no se solape
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
    }).bindPopup(`
      
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addMarkerModal" >Hecho</button>
      
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
  filesUploadSuccessfully:number=0;

  newHome() {
    this.lg.remove(this.mp);
    const formData = new FormData();
    formData.append('lat', this.afterCoords.lat);
    formData.append('lng', this.afterCoords.lng);
    formData.append('ciudad', this.home.ciudad);
    formData.append('calle', this.home.calle);
    formData.append('numero', this.home.numero);
    formData.append('cp', this.home.cp);
    formData.append('superficie', this.home.superficie);
    formData.append('garage', this.home.garage);
    formData.append('condicion', this.home.condicion);
    formData.append('tipo', this.home.tipo);
    formData.append('habitaciones', this.home.habitaciones);
    formData.append('aseos', this.home.aseos);
    formData.append('estado', this.home.estado);
    formData.append('destacar', this.home.destacar);
    formData.append('antiguedad', this.home.antiguedad);
    formData.append('precioFinal', this.home.precioFinal);
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
    formData.append('extintores', JSON.stringify(this.home.extintores));
    formData.append('generadorEmergencia', JSON.stringify(this.home.generadorEmergencia));
    formData.append('instalacionesDiscapacitados', JSON.stringify(this.home.instalacionesDiscapacitados));
    formData.append('terraza', JSON.stringify(this.home.terraza));
    formData.append('amueblado', JSON.stringify(this.home.amueblado));
    formData.append('parquet', JSON.stringify(this.home.parquet));
    formData.append('plantaMasAlta', JSON.stringify(this.home.plantaMasAlta));
    formData.append('trastero', JSON.stringify(this.home.trastero));
    formData.append('armariosEmpotrados', JSON.stringify(this.home.armariosEmpotrados));
    formData.append('piscinaPrivada', JSON.stringify(this.home.piscinaPrivada));
    formData.append('aseoEnsuite', JSON.stringify(this.home.aseoEnsuite));
    formData.append('balcon', JSON.stringify(this.home.balcon));
    formData.append('vistasDespejadas', JSON.stringify(this.home.vistasDespejadas));
    formData.append('colegios', JSON.stringify(this.colegio));
    formData.append('universidades', JSON.stringify(this.universidad));
    formData.append('supermercados', JSON.stringify(this.mercados));
    formData.append('metro', JSON.stringify(this.metro));
    formData.append('bus', JSON.stringify(this.autobus));
    formData.append('aeropuerto', JSON.stringify(this.aeropuerto));
    formData.append('distanciaAlMar', JSON.stringify(this.beach));
    formData.append('descripcion', this.home.descripcion);
    formData.append('Model', 'Flat');
    formData.append('creador', this.user.userId);
    formData.append('nombreCreador', this.user.username);
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if(this.selectedFiles[i]){
          const body=new FormData();
          body.append('image',this.selectedFiles[i]);
          this.subscriptions.push(Axios.post(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${this.selectedFiles[i].name}`,body).subscribe({
            next: (res: any) => {
              console.log(res);
              this.images[i]={
                imageId:res.data.data.id,
                imageName:res.data.data.title,
                imageUrl:res.data.data.url,
                imageDeleteUrl:res.data.data.delete_url
              };
              const msg = 'Subida correctamente: ' + this.selectedFiles[i].name;
              this.message.push(msg);
              this.filesUploadSuccessfully=i;
              console.log('subidas: '+this.filesUploadSuccessfully+' cantidad: '+this.selectedFiles.length);
              if((this.selectedFiles.length-1)==this.filesUploadSuccessfully){
                setTimeout(()=>{
                  formData.append('imagesAsString', JSON.stringify(this.images));
                  var obj = {};
                  formData.forEach((value,key)=>obj[key] = value);
                  var json=JSON.stringify(obj);
                  console.log(json);
                  this.subscriptions.push(
                      this.homeService.addHome(json).subscribe(() => {
                      this.router.navigate(['/home']),
                      this.sendNotification(NotificationType.SUCCESS, `Anuncio creado.`);
                      var resetForm = <HTMLFormElement>document.getElementById('markerForm');
                      resetForm.reset();
                      this.clickButton('new-marker-close');
                    })
                  );
                },3000);
              }
            },
            error: (err: any) => {
              const msg = 'Error al procesar la imagen: ' + this.selectedFiles[i].name;
              this.message.push(msg);
            }
          }));
        }
      }
    }

    this.map.removeLayer(this.lg);
  }

  checkBox(param): any {
    
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
