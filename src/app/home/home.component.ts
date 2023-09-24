import {
  PropertyType,
  HouseType,
  Bedrooms,
  Bathrooms,
  Badge,
  PropertyState,
  Enseñanza,
  Institucion,
  RamasConocimiento,
} from './../class/property-type.enum';
import { UserService } from './../service/user.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Map, marker, popup, LatLng, Icon } from 'leaflet';
import 'leaflet.locatecontrol';
import {
  tileLayerSelect,
  tileLayerCP,
  tileLayerWMSSelect,
  tileLayerHere,
  tileLayerWMSSelectIGN,
  tileLayerTransportes,
} from '../model/maps/functions';
import {
  grayIcon,
  greenIcon,
  grayPointerIcon,
  blackMarker,
} from '../model/maps/icons';
import { UserComponent } from '../components/user/user.component';
import { NotificationService } from '../service/notification.service';
import { AuthenticationService } from '../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from '../class/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import * as L from 'leaflet';
//import H from '@here/maps-api-for-javascript';
import { HomeService } from '../service/home.service';
import { Bus, Home, Metro, Supermercado, Universidad } from '../model/home';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import {
  OpenStreetMapProvider,
  GeoSearchControl,
  SearchControl,
} from 'leaflet-geosearch';
import { BehaviorSubject } from 'rxjs';
import { FormControl, NgModel } from '@angular/forms';
import { Colegio } from '../model/home';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import 'leaflet-routing-machine';

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
    private sanitizer: DomSanitizer
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr
    );
    this.IsChecked = false;
    this.IsIndeterminate = false;
    this.LabelAlign = 'after';
    this.IsDisabled = false;
  }

  IsChecked: boolean;
  IsIndeterminate: boolean;
  LabelAlign: 'after' | 'before';
  IsDisabled: boolean;

  map!: L.map; // map allocates homes
  map2!: L.Map; // map geocoding search location
  map3!: L.Map; // map to set nearly services
  //hereMap!: H.Map;
  lg = new L.LayerGroup();
  mp!: L.Marker;
  markerHouse!: L.Marker; // punto de referencia para los servicios
  markerSchool!: L.Marker;
  fg = L.featureGroup();
  popup = L.popup();
  beforeCoords!: L.LatLng; // coordenadas de ubicacion actual del usuario al inicio
  afterCoords!: L.LatLng; // coordenadas de la ubicación donde el usuario desea situar su anuncio
  nextCoords!: L.LatLng; // coordenadas temporales para situar cada servicio

  home: Home = new Home();
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

  images: any = [];
  prev!: string;
  doorsMainProperty!: string;
  propertyImage: File;
  // textfield geosearch
  provincia: string;

  // para introducir servicios proximos
  //<div class="accordion-item" *ngIf="isEmptyArray(this.colegios)">
  colegiosPrimaria: Colegio[];
  colegiosSecundaria: Colegio[];
  universidad: Universidad[];
  autobuses: Bus[];
  lineasMetro: Metro[];
  supermercados: Supermercado[];

  // funcion que muestra/esconde el modal
  @ViewChild('element') element: ElementRef;
  @ViewChild('map_3') map_3?: ElementRef;
  openToogleModal(flag: boolean) {
    if (flag) {
      if (this.afterCoords == null || this.afterCoords == undefined) {
        // remove to production
        this.afterCoords = this.beforeCoords;
      }
      this.nextCoords=this.afterCoords;
      
      this.element.nativeElement.classList.add('modal-open');
      // cargar el siguiente mapa
      this.map3 = L.map('map_3', { renderer: L.canvas() }).setView(
        [this.afterCoords.lat, this.afterCoords.lng],
        15
      );
      //tileLayerSelect().addTo(this.map3);
      //tileLayerTransportes().addTo(this.map3);
      //tileLayerWMSSelect().addTo(this.map3);
      tileLayerWMSSelectIGN().addTo(this.map3);
      //tileLayerHere().addTo(this.map3);
      this.markerHouse = new L.marker(this.afterCoords, {
        draggable: false,
        icon: grayPointerIcon,
      });
      this.markerHouse.addTo(this.map3);
    } else {
      this.element.nativeElement.classList.remove('modal-open');
    }
  }

  // rutas próximas
  setRoute() {
    var control = L.Routing.control({
      waypoints: [L.latLng(this.afterCoords), L.latLng(this.nextCoords)],
      createMarker: function (i, wp, nWps) {
        if (i === 0) {
          // Servicio (destino)
          return L.marker(wp.latLng, {
            icon: grayIcon, 
            draggable: true,
            name:'destiny'
          }).bindPopup(`
      
          <button type="button" class="btn btn-secondary" >Guardar</button>
          
          `).on('moveend', () => console.log())
          
        } else if(i == nWps -1) {
          // Casa (origen)
          return L.marker(wp.latLng, {
            icon: grayPointerIcon,
            draggable: false,
          });
        }
      },
      routeWhileDragging: true,
      lineOptions: {
        styles: [
          {
            color: '#3a3b3c',
            weight: 4,
          },
        ],
      },
    }).addTo(this.map3);
    /*this.mp.on('move', () => (this.afterCoords = this.mp.getLatLng()));
    this.mp.on('moveend', () => console.log(this.afterCoords));
    this.mp.on('dragend', () => this.mp.openPopup());*/
  }

  printRoute() {}

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

  isEmptyArray(array: unknown): array is Array<unknown> {
    if (Array.isArray(array) && array.length) {
      return true;
    } else {
      return false;
    }
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
    if (this.provincia == null) {
      alert('Introduzca la provincia!');
    } else {
      var x = document.getElementById('provButton2');
      x.style.display = 'none';
      x = document.getElementById('map_2');
      x.style.display = 'none';
      x = document.getElementById('provButton');
      x.style.display = 'block';
      x.innerHTML = this.provincia;
      this.map2.remove();
      this.home.ciudad = this.provincia.split(' ')[0].replace(',', '');
      console.log(this.home.ciudad);
    }
  }

  locationMap() {
    const search = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      popupFormat: ({ result }) => (this.provincia = result.label),
      searchLabel: 'Ciudad',
      resultFormat: ({ result }) => result.label,
      marker: {
        icon: new L.Icon.Default(),
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
    //tileLayerSelect().addTo(map2);
    //tileLayerWMSSelect().addTo(map2);
    //tileLayerCP().addTo(map2); // Codigos postales
    tileLayerWMSSelectIGN().addTo(this.map2);
    //tileLayerHere().addTo(this.map2);
    this.map2.addControl(search);
    var x = document.getElementById('provButton');
    x.style.display = 'none';
    var x = document.getElementById('provButton2');
    x.style.display = 'block';
  }

  /************************************************************/
  ngOnInit(): void {
    this.userMarkerEvents(); // inicializar opciones
    this.map = L.map('map', { renderer: L.canvas() }).setView(
      [39.46975, -0.37739],
      25
    );
    this.getLocation();
    //tileLayerSelect().addTo(map);
    //tileLayerWMSSelect().addTo(map);
    //tileLayerCP().addTo(map); // Codigos postales
    tileLayerWMSSelectIGN().addTo(this.map);
    //tileLayerHere().addTo(this.map);

    //carga dinamica
    this.subscriptions.push(
      this.homeService.getHomes().subscribe((data) => {
        data.map((Home) => {
          marker(
            [Number(Home.lat), Number(Home.lng)],
            { icon: greenIcon },
            this.opt
          )
            .bindTooltip(
              `
            <div class="pane">
            <div class="row row-cols-2" main>
              <div class="col info">
                <h6>Calle ${Home.calle}</h6>
                <div class="aa-agent-social">
                <a href="#"><i class="fa fa-facebook"></i></a>
                <a href="#"><i class="fa fa-twitter"></i></a>
                <a href="#"><i class="fa fa-linkedin"></i></a>
                <a href="#"><i class="fa fa-google-plus"></i></a>
                <a href="#"><i class="fa-thin fa-face-awesome"></i></a>
                
              </div>
              </div>
              <div class="col thumb" >  
                <img class="img-fluid " src=${Home.imageUrl}>
              </div>
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
                opacity: 0.85,
                className: 'tooltipX',
              }
            ) //
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

  saveImage(event): any {
    this.propertyImage = event.target.files[0];
  }

  createHome2() {
    //this.lg.remove(this.mp);
    /*  const formData = new FormData();
    formData.append('lat', this.afterCoords.lat);
    formData.append('lng', this.afterCoords.lng);
    formData.append('foto', this.propertyImage);
    formData.append('descripcion', this.home.descripcion);
    formData.append('calle', this.edificio.calle);
    formData.append('numero', this.edificio.numero);
    formData.append('cp', this.edificio.cp);
    formData.append('puertas', this.edificio.puertas);
    formData.append('starRating', this.edificio.valoracion);
    this.subscriptions.push(
      this.edificioService.addBuilding(formData).subscribe((res) => {
        this.router.navigate(['/home']),
          this.sendNotification(NotificationType.SUCCESS, ` Edificio creado.`);
        var resetForm = <HTMLFormElement>document.getElementById('markerForm');
        resetForm.reset();
        this.clickButton('new-marker-close');
      })
    );
    this.map.removeLayer(this.lg);*/
  }

  // Métodos para los checkboxes
  changeEvent($event) {
    console.log($event.checked);
    //$event.source.toggle();
    $event.source.focus();
    if ($event.checked) {
      // this.favourite.userId=
      //this.favourite.addId=
    }
    console.log();
  }

  checkBox($event): void {
    /*if(this.checkbox===true){
        this.favourite.addId=this.edificio.edificioId;
        //this.favourite.userId=;
    }*/
    // console.log('funcionando');
  }

  // Nueva vivienda
  createHome() {
    const formData = new FormData();
    formData.append('lat', this.afterCoords.lat);
    formData.append('lng', this.afterCoords.lng);
    formData.append('foto', this.home.imageUrl);
    formData.append('descripcion', this.home.descripcion);
    formData.append('calle', this.home.calle);
    formData.append('numero', this.home.numero);
    formData.append('cp', this.home.cp);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
