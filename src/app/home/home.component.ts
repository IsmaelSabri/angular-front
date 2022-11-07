<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { Map, marker, popup, LatLng, Icon } from 'leaflet';
import "leaflet.locatecontrol";
=======
import { EdificioService } from './../service/edificio.service';
import { Edificio } from './../model/edificio';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Map, marker, popup, LatLng, Icon } from 'leaflet';
import 'leaflet.locatecontrol';
>>>>>>> c96ab33 (contact-form)
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
<<<<<<< HEAD
import { Router, ActivatedRoute } from '@angular/router';
=======
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
>>>>>>> c96ab33 (contact-form)
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerService } from 'src/app/service/marker.service';
import { Marker } from '../model/marker';
import { NotificationType } from '../class/notification-type.enum';
import { pipe, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import * as L from 'leaflet';
<<<<<<< HEAD
import { Edificio } from '../model/edificio';
=======
>>>>>>> c96ab33 (contact-form)
import { Vivienda } from '../model/vivienda';
import { ToastrService } from 'ngx-toastr';
//import 'leaflet.BounceMarker'
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends UserComponent implements OnInit {
<<<<<<< HEAD
=======

  @Output() edificioParam =new EventEmitter<Edificio>();

>>>>>>> c96ab33 (contact-form)
  imagenes = [
    'img/background.png',
    'img/background2.png',
    'img/background3.png',
  ];

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UsuarioService,
    notificationService: NotificationService,
    private markerService: MarkerService,
    route: ActivatedRoute,
<<<<<<< HEAD
    toastr:ToastrService,
    private sanitizer: DomSanitizer
=======
    toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private edificioService: EdificioService
>>>>>>> c96ab33 (contact-form)
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr
    );
<<<<<<< HEAD

    
  }
  
  map!: L.map;
  lg!: L.LayerGroup;
  vivienda:Vivienda=new Vivienda();
  edificio:Edificio=new Edificio();
=======
  }

  map!: L.map;
  lg!: L.LayerGroup;
  vivienda: Vivienda = new Vivienda();
  edificio: Edificio = new Edificio();
  //private edificio$=new BehaviorSubject<Edificio>(this.edificio);
  edificios:any=[];
>>>>>>> c96ab33 (contact-form)
  marker: Marker = new Marker();
  state: boolean = this.authenticationService.isUserLoggedIn();
  opt = {};
  coords!: L.LatLng; // ubicacion actual del usuario al inicio
  markerCoords!: L.LatLng;
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
<<<<<<< HEAD
  mp!: L.Marker;
  fg= L.featureGroup();
  fotos:any=[];
  prev!:string;
  puertasEdificio!:string;
  
=======
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
>>>>>>> c96ab33 (contact-form)

  /************************************************************/
  ngOnInit(): void {
    this.userMarkerEvents(); // inicializar opciones
<<<<<<< HEAD
    this.map=L.map('map',{renderer:L.canvas()}).setView([39.46975, -0.37739], 25);
=======
    this.map = L.map('map', { renderer: L.canvas() }).setView(
      [39.46975, -0.37739],
      25
    );
>>>>>>> c96ab33 (contact-form)
    this.getLocation();
    //tileLayerSelect().addTo(map);
    //tileLayerWMSSelect().addTo(map);
    //tileLayerCP().addTo(map); // Codigos postales
    tileLayerWMSSelectIGN().addTo(this.map);
    // Cargar markers de forma dinámica
    this.subscriptions.push(
      this.markerService.getMarkers().subscribe((data) => {
        data.map((point) => {
          marker(
            [Number(point.lat), Number(point.lng)],
            { icon: this.grayIcon },
            this.opt
          ).addTo(this.map);
<<<<<<< HEAD

=======
>>>>>>> c96ab33 (contact-form)
          //marker.on("click", ()=> console.log(""));
        });
      })
    );

<<<<<<< HEAD
=======
    this.subscriptions.push(
      this.markerService.getBuildings().subscribe((data) => {
        data.map((Edificio) => {
          marker(
            [Number(Edificio.lat), Number(Edificio.lng)],
            { icon: this.greenIcon }, this.opt)
            .bindTooltip(`
            <div class="container">
            <div class="row mb-2 mt-2 text-center">
              <div class="col-md-4">
                <h6>Calle ${Edificio.calle}</h6>
                <h6>Número ${Edificio.numero}</h6>
              </div>     
                 <img style='height: 100%; width: 100%; object-fit: contain' alt='popupImage' src=${Edificio.imageUrl}>
            </div>

            `,{maxWidth: 90,maxHeight:60, removable: true, editable: true, direction: 'right',
            permanent: false,
            sticky: false,
            offset: [10, 0],
            opacity: 0.75,
            className: 'leaflet-tooltip-own'  })
            .on('click',()=>(
            this.edificioService.edificio=Edificio,
            this.router.navigate(['/add'])
            )).addTo(this.map);
        });
      })
    );

    
//            <button type="button" class="btn btn-secondary" data-toggle="modal" onclick="${this.viewAdd(Edificio.edificioId)}">Ver</button>

>>>>>>> c96ab33 (contact-form)
    /*  fitbounds para centrar el foco en los marcadores
    const markerItem = marker([39.46975, -0.37739]) // marker de prueba. Los usuarios podrán crear sus markers
      .addTo(map)
      .bindPopup('Marker de prueba');
    map.fitBounds([[markerItem.getLatLng().lat, markerItem.getLatLng().lng]]); //centramos la camara en la ubicación del marcador
  */

    //L.Control.Zoom({ position: 'topright' }).addTo(this.map);
    //
  }

<<<<<<< HEAD
=======

>>>>>>> c96ab33 (contact-form)
  /*
      Si el usuario logueado en sesión coincide con el usuario que creó el marker
      se activarán todos los eventos de ratón, arrastre etc.
      Por ahora mientras esté logeado es suficiente
      */
  userMarkerEvents() {
    if (this.state) {
<<<<<<< HEAD
      this.opt = { draggable: true, locateControl:true, bounceOnAdd:true };
    } else {
      this.opt = { draggable: false, locateControl:true, bounceOnAdd:true };
    }
  }

  getLocation(){
    this.map.on('locationfound', (e: { accuracy: number; latlng: LatLng }) => {
      this.coords = e.latlng;//Object.assign({}, e.latlng);
      this.map.setView(this.coords,25); // poner el foco en el mapa
      this.map.fitBounds([[this.coords.lat, this.coords.lng]]);// por si acaso..
=======
      this.opt = { draggable: true, locateControl: true, bounceOnAdd: true };
    } else {
      this.opt = { draggable: false, locateControl: true, bounceOnAdd: true };
    }
  }

  getLocation() {
    this.map.on('locationfound', (e: { accuracy: number; latlng: LatLng }) => {
      this.coords = e.latlng; //Object.assign({}, e.latlng);
      this.map.setView(this.coords, 25); // poner el foco en el mapa
      this.map.fitBounds([[this.coords.lat, this.coords.lng]]); // por si acaso..
>>>>>>> c96ab33 (contact-form)
    });
    this.map.on('locationerror', this.notFoundLocation); // si el usuario no activa la geolocalización
    this.map.locate({ setView: true, maxZoom: 25 }); // llamada para que la geolocalización funcione
  }

  notFoundLocation() {
<<<<<<< HEAD
    alert('No podemos saber donde se encuentra si no habilita la Geolocalización.');
  }

  createLocationMarker() {
  console.log(this.coords);
  
    this.toastr.success(
      'Arrastra el marcador!', 'Mueve el marcador hasta su propiedad!'
            );
  
   this.mp= new L.marker(this.coords, {
=======
    alert(
      'No podemos saber donde se encuentra si no habilita la Geolocalización.'
    );
  }

  createLocationMarker() {
    console.log(this.coords);

    this.toastr.success(
      'Arrastra el marcador!',
      'Mueve el marcador hasta su propiedad!'
    );

    this.mp = new L.marker(this.coords, {
>>>>>>> c96ab33 (contact-form)
      draggable: true,
      bounceOnAdd: true,
      //bounceOnAddOptions: {duration: 500, height: 100, loop: 2}
    }).bindPopup(`
    
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addMarkerModal"  >Hecho</button>
    
    `);
<<<<<<< HEAD
    this.lg= new L.LayerGroup([this.mp]);
    this.lg.addTo(this.map);
    /*const popupItem=L.popup().setLatLng(this.coords)
    .setContent('<h5>Arrastrame a mi sitio</h5>')
    .openOn(this.mp);*/
    this.mp.on('move', () => 
    this.markerCoords=this.mp.getLatLng(),
    );
    this.mp.on('moveend', () =>
    console.log(this.markerCoords)
    );
    this.mp.on('dragend', () =>
    this.mp.openPopup()
    );
  } 
  // Revisar
  closeNewPopup(){
    this.mp.closePopup();
  }
  // Revisar - en el html -> oninput="textAreaResize(this)"
  textAreaResize(e){
    e.style.height = "5px";
    e.style.height = (e.scrollHeight)+"px";
  }

  saveImage(event):any{
      this.edificio.foto=event.target.files[0];
      this.extraerBase64(this.edificio.foto).then((imagen:any)=>{
        this.prev=imagen.base;
      })
      //this.fotos.push(this.edificio.foto);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
=======
    this.lg = new L.LayerGroup([this.mp]);
    this.lg.addTo(this.map);
    
    /*const popupItem=L.popup().setLatLng(this.coords)
    .setContent('<h5>Arrastrame a mi sitio</h5>')
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

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
>>>>>>> c96ab33 (contact-form)
    if (charCode >= 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
<<<<<<< HEAD

  }

  createMarker() {
    //this.lg.remove(this.mp); 
    const formData = new FormData();
    formData.append('lat', this.coords.lat);
    formData.append('lng', this.coords.lng);
    formData.append('starRating',this.edificio.valoracion);
    this.subscriptions.push(
      this.markerService.addMarker(formData).subscribe((res) => {
        this.router.navigate(['/home']),
          this.sendNotification(NotificationType.SUCCESS, ` Marker creado.`);
=======
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
      this.markerService.addBuilding(formData).subscribe((res) => {
        this.router.navigate(['/home']),
          this.sendNotification(NotificationType.SUCCESS, ` Edificio creado.`);
>>>>>>> c96ab33 (contact-form)
        var resetForm = <HTMLFormElement>document.getElementById('markerForm');
        resetForm.reset();
        this.clickButton('new-marker-close');
      })
    );
<<<<<<< HEAD
=======
    this.map.removeLayer(this.lg);
>>>>>>> c96ab33 (contact-form)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
