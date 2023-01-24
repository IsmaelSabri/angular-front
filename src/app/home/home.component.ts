import { EdificioService } from './../service/edificio.service';
import { Edificio } from './../model/edificio';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Map, marker, popup, LatLng, Icon } from 'leaflet';
import 'leaflet.locatecontrol';
import {
  tileLayerSelect,
  tileLayerCP,
  tileLayerWMSSelect,
  tileLayerWMSSelectIGN,
} from '../model/functions';
import { UserComponent } from '../components/user/user.component';
import { NotificationService } from '../service/notification.service';
import { AuthenticationService } from '../service/authentication.service';
import { UsuarioService } from '../service/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from '../class/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import * as L from 'leaflet';
import { Property } from '../model/property';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','custom-leaflet.css'],
})
export class HomeComponent extends UserComponent implements OnInit, OnDestroy {

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UsuarioService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    private edificioService: EdificioService
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

  map!: L.map;
  lg!: L.LayerGroup;
  property: Property = new Property();
  edificio: Edificio = new Edificio();
  edificios:any=[];
  state: boolean = this.authenticationService.isUserLoggedIn();
  opt = {};
  coords!: L.LatLng; // coordenadas de ubicacion actual del usuario al inicio
  markerCoords!: L.LatLng; // coordenadas de la ubicación donde el usuario desea situar su anuncio
  mydate = new Date().getTime();
  grayIcon = new Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  mp!: L.Marker;
  fg = L.featureGroup();
  popup = L.popup();
  images: any = [];
  prev!: string;
  doorsMainProperty!: string;
  propertyImage: File;

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

      //carga de edificios
    this.subscriptions.push(
      this.edificioService.getBuildings().subscribe((data) => {
        data.map((Edificio) => {
          marker(
            [Number(Edificio.lat), Number(Edificio.lng)],
            { icon: this.greenIcon }, this.opt)
            .bindTooltip(`

            <div class="pane">
            <div class="row row-cols-2" main>
              <div class="col info">
                <h6>Calle ${Edificio.calle}</h6>
                <div class="aa-agent-social">
                <a href="#"><i class="fa fa-facebook"></i></a>
                <a href="#"><i class="fa fa-twitter"></i></a>
                <a href="#"><i class="fa fa-linkedin"></i></a>
                <a href="#"><i class="fa fa-google-plus"></i></a>
                <a href="#"><i class="fa-thin fa-face-awesome"></i></a>
                
              </div>
              </div>
              <div class="col thumb" >  
                <img class="img-fluid " src=${Edificio.imageUrl}>
              </div>
              </div>
            </div>

            `,{maxWidth: 150,maxHeight:80, removable: true, editable: true, direction: 'top',
            permanent: false,
            sticky: false,
            offset: [0, -45],
            opacity: 0.85,
            className: 'tooltipX'  }) //
            .on('click',()=>(
            localStorage.removeItem("currentBuilding"),
            localStorage.setItem("currentBuilding",JSON.stringify(Edificio)),
            this.router.navigate(['/add'])
            )).addTo(this.map);
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
      this.opt = { draggable: true, locateControl: true };
    } else {
      this.opt = { draggable: false, locateControl: true };
    }
  }

  getLocation() {
    this.map.on('locationfound', (e: { accuracy: number; latlng: LatLng }) => {
      this.coords = e.latlng; //Object.assign({}, e.latlng);
      this.map.setView(this.coords, 25); // poner el foco en el mapa
      this.map.fitBounds([[this.coords.lat, this.coords.lng]]); // por si acaso..
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
    console.log(this.coords);
    this.markerCoords=this.coords;
    
    this.toastr.success(
      'Arrastra el marcador!',
      'Mueve el marcador hasta su propiedad!'
    );

    this.mp = new L.marker(this.coords, {
      draggable: true
    }).bindPopup(`
    
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addMarkerModal"  >Hecho</button>
    
    `);
    this.lg = new L.LayerGroup([this.mp]);
    this.lg.addTo(this.map);
    
    /*const popupItem=L.popup().setLatLng(this.coords)
    .setContent('<h5>Arrastrame a una ubicación exacta</h5>')
    .openOn(this.mp);*/
    this.mp.on('move', () => (this.markerCoords = this.mp.getLatLng()));
    this.mp.on('moveend', () => console.log(this.markerCoords));
    this.mp.on('dragend', () => this.mp.openPopup());
  }

  // Revisar - en el html -> oninput="textAreaResize(this)"
  textAreaResize(e) {
    e.style.height = '5px';
    e.style.height = e.scrollHeight + 'px';
  }

  saveImage(event): any {
    this.propertyImage = event.target.files[0];
  }

  createEdificio() {
    //this.lg.remove(this.mp);
    const formData = new FormData();
    formData.append('lat', this.markerCoords.lat);
    formData.append('lng', this.markerCoords.lng);
    formData.append('foto', this.propertyImage);
    formData.append('descripcion', this.edificio.descripcion);
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
    this.map.removeLayer(this.lg);
  }

  // Métodos para los checkboxes
  changeEvent($event) {
    console.log($event.checked);
    //$event.source.toggle();
    $event.source.focus();
    if($event.checked){
     // this.favourite.userId=
      //this.favourite.addId=
    }
    console.log();
  }

  checkBox($event): void{
    /*if(this.checkbox===true){
        this.favourite.addId=this.edificio.edificioId;
        //this.favourite.userId=;
    }*/
   // console.log('funcionando');
  }

  // Nueva vivienda
  createProperty(){
    const formData = new FormData();
    formData.append('lat', this.markerCoords.lat);
    formData.append('lng', this.markerCoords.lng);
    formData.append('foto', this.property.imageUrl);
    formData.append('descripcion', this.property.descripcion);
    formData.append('calle', this.property.calle);
    formData.append('numero', this.property.numero);
    formData.append('cp', this.property.cp);
    formData.append('puertas', this.edificio.puertas);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
