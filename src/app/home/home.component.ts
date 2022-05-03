import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Map, marker, popup, LatLng } from 'leaflet';
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
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario';
import { FileUploadStatus } from '../model/file-upload.status';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MarkerService } from 'src/app/service/marker.service';
import { Marker } from '../model/marker';
import { NotificationType } from '../class/notification-type.enum';
import { pipe, Observable } from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import * as L from 'leaflet';

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
    private markerService: MarkerService
  ) {
    super(router, authenticationService, userService, notificationService);
  }
  map:any;
  marker: Marker = new Marker();
  state: boolean = this.authenticationService.isUserLoggedIn();
  opt={};

  ngOnInit(): void {
    
    this.userMarkerEvents();
    this.map = L.map('map').setView([39.46975, -0.37739], 12);
    //tileLayerSelect().addTo(map);
    //tileLayerWMSSelect().addTo(map);
    //tileLayerCP().addTo(map); // Codigos postales
    tileLayerWMSSelectIGN().addTo(this.map);
    // Cargar markers de forma dinámica
    this.subscriptions.push(
    this.markerService.getMarkers().subscribe(data=>{
      data.map((point)=>{
        marker([Number(point.lat), Number(point.lng)],this.opt).addTo(this.map);

        //marker.on("click", ()=> console.log(""));
      })
    })
    );
    //funcion para crear el marker a traves de la localización del usuario
    
    
    /*  fitbounds para centrar el foco en los marcadores
    const markerItem = marker([39.46975, -0.37739]) // marker de prueba. Los usuarios podrán crear sus markers
      .addTo(map)
      .bindPopup('Marker de prueba');
    map.fitBounds([[markerItem.getLatLng().lat, markerItem.getLatLng().lng]]); //centramos la camara en la ubicación del marcador
  */
  
  //  this.createMarker2();
    
    
  }

  /*
      Si el usuario logueado en sesión coincide con el usuario que creó el marker
      se activarán todos los eventos de ratón, arrastre etc.
      Por ahora mientras esté logeado es suficiente
      */
  userMarkerEvents(){
    if(this.state){
      this.opt={draggable:true};
      }else{
        this.opt={draggable:false};
      }
  }

  createMarker2() {
    this.map.on('locationfound',(e:{
      accuracy:number,latlng:LatLng
    })=>{
      const markerItem = marker([e.latlng.lat, e.latlng.lng],{draggable:true}).addTo(map)
      .bindPopup(`
      <button>Hecho</button>
      `);
    });
  }

  createMarker() {
    const formData = new FormData();
    formData.append("lat",this.marker.lat);
    formData.append("lng",this.marker.lng);
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
