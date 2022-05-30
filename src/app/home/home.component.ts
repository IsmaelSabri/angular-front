import { Component, OnInit } from '@angular/core';
import { Map, marker, popup, LatLng, Icon } from 'leaflet';
import "leaflet.locatecontrol";
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
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerService } from 'src/app/service/marker.service';
import { Marker } from '../model/marker';
import { NotificationType } from '../class/notification-type.enum';
import { pipe, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import * as L from 'leaflet';
import { Edificio } from '../model/edificio';
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
    toastr:ToastrService,
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

    
  }
  
  map!: L.map;
  lg!: L.LayerGroup;
  vivienda:Vivienda=new Vivienda();
  edificio:Edificio=new Edificio();
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
  mp!: L.Marker;
  fg= L.featureGroup();
  fotos:any=[];
  prev!:string;
  puertasEdificio!:string;
  

  /************************************************************/
  ngOnInit(): void {
    this.userMarkerEvents(); // inicializar opciones
    this.map=L.map('map',{renderer:L.canvas()}).setView([39.46975, -0.37739], 25);
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

          //marker.on("click", ()=> console.log(""));
        });
      })
    );

    /*  fitbounds para centrar el foco en los marcadores
    const markerItem = marker([39.46975, -0.37739]) // marker de prueba. Los usuarios podrán crear sus markers
      .addTo(map)
      .bindPopup('Marker de prueba');
    map.fitBounds([[markerItem.getLatLng().lat, markerItem.getLatLng().lng]]); //centramos la camara en la ubicación del marcador
  */

    //L.Control.Zoom({ position: 'topright' }).addTo(this.map);
    //
  }

  /*
      Si el usuario logueado en sesión coincide con el usuario que creó el marker
      se activarán todos los eventos de ratón, arrastre etc.
      Por ahora mientras esté logeado es suficiente
      */
  userMarkerEvents() {
    if (this.state) {
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
    });
    this.map.on('locationerror', this.notFoundLocation); // si el usuario no activa la geolocalización
    this.map.locate({ setView: true, maxZoom: 25 }); // llamada para que la geolocalización funcione
  }

  notFoundLocation() {
    alert('No podemos saber donde se encuentra si no habilita la Geolocalización.');
  }

  createLocationMarker() {
  console.log(this.coords);
  
    this.toastr.success(
      'Arrastra el marcador!', 'Mueve el marcador hasta su propiedad!'
            );
  
   this.mp= new L.marker(this.coords, {
      draggable: true,
      bounceOnAdd: true,
      //bounceOnAddOptions: {duration: 500, height: 100, loop: 2}
    }).bindPopup(`
    
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addMarkerModal"  >Hecho</button>
    
    `);
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
    if (charCode >= 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
        var resetForm = <HTMLFormElement>document.getElementById('markerForm');
        resetForm.reset();
        this.clickButton('new-marker-close');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
