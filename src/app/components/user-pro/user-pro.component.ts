import { ProfileImage } from './../../model/user';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { User } from 'src/app/model/user';
import { Home, HomeImage } from 'src/app/model/home';
import { Chat } from 'src/app/model/chat';
import * as signalR from '@microsoft/signalr';
import { cssPathUserPro } from 'src/app/model/performance/css-styles';
import { dynamicUserProScripts } from 'src/app/model/performance/js-scripts';
import { ChatService } from 'src/app/service/chat.service';
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HomeService } from 'src/app/service/home.service';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/service/image.service';
import _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Views } from 'src/app/class/property-type.enum';
import { initFlowbite } from 'flowbite';
import { MatSidenav } from '@angular/material/sidenav';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { grayPointerIcon } from 'src/app/model/maps/icons';
import { Jawg_Sunny, Stadia_OSMBright } from 'src/app/model/maps/functions';
import { HomeComponent } from 'src/app/home/home.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { homeicon } from '../../model/maps/icons';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine-here';
import { APIKEY } from 'src/environments/environment.prod';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import Axios from 'axios-observable';
import GestureHandling from 'leaflet-gesture-handling';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-pro',
  templateUrl: './user-pro.component.html',
  styleUrl: './user-pro.component.css',
})
export class UserProComponent extends HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  protected styleUser: HTMLLinkElement[] = [];
  userUpdate: User = new User();
  homes: Home[] = [];
  home: Home = new Home();
  routerLinkId: number = 0;
  routerLinkModel: string;

  chats: Chat[] = [];
  selectedUserId: string = "";
  selectedUser: User = new User();
  hub: signalR.HubConnection | undefined;
  message: string = "";

  vistas: string[] = Object.values(Views);
  @ViewChild('sidenav') sidenav: MatSidenav;
  resizeStyleListSidenav = { "max-width": `100vh !important`, };

  constructor(
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    protected modalServiceBs: BsModalService,
    @Inject(DOCUMENT) protected document: Document,
    protected sanitizer: DomSanitizer,
    primengConfig: PrimeNGConfig,
    messageService: MessageService,
    protected chatService: ChatService,
    protected homeService: HomeService,
    protected imageService: ImageService,
    protected notification: NzNotificationService,
    protected nzMessage: NzMessageService,
    protected modalService: NgbModal,
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
      notification
    );
  }

  startChatConnection() {
    this.hub = new signalR.HubConnectionBuilder().withUrl("https://localhost:4040/chat-hub").build();
    this.hub.start().then(() => {
      console.log("Connection is started...");
      this.hub?.invoke("Connect", this.user.id);
      this.hub?.on("Users", (res: User) => {
        //console.log(res);
        this.users.find(p => p.id == res.id)!.status = res.status;
      });
      this.hub?.on("Messages", (res: Chat) => {
        //console.log(res);
        if (this.selectedUserId == res.userId) {
          this.chats.push(res);
        }
      })
    })
  }

  ngAfterViewInit(): void {
    if (this.router.lastSuccessfulNavigation.extras.state) {
      setTimeout(() => {
        const currentState = this.router.lastSuccessfulNavigation;
        this.clickButton(currentState?.extras.state.tab);
      }, 500);
    }
  }

  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  protected ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  changeUser(user: User) {
    this.selectedUserId = user.id;
    this.selectedUser = user;
    this.subscriptions.push(this.chatService.getChats(this.user.id, this.selectedUserId).subscribe({
      next: (res: any) => {
        this.chats = res;
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, `No se ha podido cargar el chat. Intentelo pasados unos minutos.` + err);
      }
    }));
  }

  sendMessage() {
    const data = {
      "userId": this.user.id,
      "toUserId": this.selectedUserId,
      "message": this.message
    }
    this.subscriptions.push(this.chatService.sendMessage(data).subscribe({
      next: (res: any) => {
        this.chats.push(res);
        this.message = '';
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, `No se ha podido enviar el mensaje. Intentelo pasados unos minutos.` + err);
      }
    }));
  }

  getAvatar(file: string): ProfileImage {
    return JSON.parse(file);
  }

  preSelectedViews: string[] = []
  preSelectedTypes: string[] = []
  yearAntiguedad: Date;
  yearFindeObra: Date;
  openSidenav(home: Home) {
    if (home) {
      this.subscriptions.push(this.homeService.getHomesByQuery('model@=*' + home.model + ',' + 'viviendaId@=*' + home.viviendaId + ',').subscribe({
        next: (res: any[]) => {
          if (res) {
            this.home = this.homeService.performHome(res[0]);
            if (this.home.vistasDespejadas) {
              this.preSelectedViews = this.home.vistasDespejadas.split(',');
            }
            if (this.home.tipos) {
              this.preSelectedTypes = this.home.tipos.split(',');
            }
            if (this.home.antiguedad) {
              this.yearAntiguedad = new Date(this.home.antiguedad + '-1-1');
            }
            if (this.home.finDeObra) {
              this.yearFindeObra = new Date(this.home.finDeObra + '-1-1');
            }
            if (this.home.energyCertAsString) {
              this.energyImage = this.sanitizer.bypassSecurityTrustResourceUrl(this.home.energyCert.imageUrl);
            }
            if (this.imageChangedEventEnergyUpdate) {
              this.croppedImageEnergyUpdate = null;
              this.imageChangedEventEnergyUpdate = null;
              this.tempEnergyUpdate = null;
              this.tempEnergyTagNameUpdate = null;
            }
            if (this.home.aseoEnsuite >= 6) {
              this.homeDto.aseoEnsuite = '5+';
            }
            if (this.home.piso) {
              this.homeDto.piso = this.home.piso.split('/')[0];
              this.homeDto.plantaMasAlta = this.home.piso.split('/')[1];
            }
            if (this.home.precioFinal && !this.home.precioAlquiler) {
              this.homeDto.precioFinal = this.home.precioFinal;
            } else if (!this.home.precioFinal && this.home.precioAlquiler) {
              this.homeDto.precioAlquiler = this.home.precioAlquiler;
            } else if (this.home.precioFinal && this.home.precioAlquiler) {
              this.homeDto.precioAlquiler = this.home.precioAlquiler;
              this.homeDto.precioFinal = this.home.precioFinal;
            }
            // pinta el mapa de los servicios
            setTimeout(() => {
              if (this.map3 == undefined) {
                L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
                this.map3 = L.map('map_3', {
                  renderer: L.canvas(),
                  gestureHandling: false,
                }).setView([this.home.lat, this.home.lng], 15);
                //Stadia_OSMBright().addTo(this.map3);
                Jawg_Sunny().addTo(this.map3);
                this.markerHouse = new L.marker([this.home.lat, this.home.lng], {
                  draggable: false,
                  icon: homeicon,
                });
                this.markerHouse.addTo(this.map3);
              }
            }, 1000);
            // arrays para los servicios
            this.colegio = JSON.parse(this.home.colegios);
            this.universidad = JSON.parse(this.home.universidades);
            this.mercados = JSON.parse(this.home.supermercados);
            this.autobus = JSON.parse(this.home.bus);
            this.aeropuerto = JSON.parse(this.home.aeropuerto);
            this.beach = JSON.parse(this.home.distanciaAlMar);
            this.metro = JSON.parse(this.home.metro);
            // advice checkboxes
            this.colegio.forEach((item, index) => {
              if (item.nombre.length > 0) {
                this.stateTextfields[0][index] = true;
              }
            });
            this.universidad.forEach((item, index) => {
              if (item.nombre.length > 0) {
                this.stateTextfields[1][index] = true;
              }
            });
            this.autobus.forEach((item, index) => {
              if (item.parada.length > 0) {
                this.stateTextfields[2][index] = true;
              }
            })
            this.mercados.forEach((item, index) => {
              if (item.nombre.length > 0) {
                this.stateTextfields[2][index + 3] = true;
              }
            })
            if (this.metro[0].parada.length > 0) {
              this.stateTextfields[3][0] = true;
            }
            if (this.aeropuerto[0].nombre.length > 0) {
              this.stateTextfields[3][1] = true;
            }
            if (this.beach[0].nombre.length > 0) {
              this.stateTextfields[3][2] = true;
            }
            this.waypointsFrom = new L.latLng(this.home.lat, this.home.lng); // había que instanciarlo para la herencia en setRoute()
            // dropzone
            if (this.dropComponent) { // a veces no carga a tiempo
              this.loadImagesEditForm();
            } else {
              this.loadImagesEditForm();
            }


          }
        },
        error: () => { }
      }))
    }
  }

  dropzoneMessage: any;
  public onUploadSuccessToEdit(args: any): void {
    console.log('onUploadSuccess:', args);
    let index = this.dropzone.options.maxFiles;
    $(document).ready(function () {
      $('[class="dz-remove"]').each(function (index, v) {
        var text = $(v).text();
        var new_text = text.replace("Remove file", "Borrar");
        $(v).text(new_text);
      });
    });
  }

  loadImagesEditForm() {
    setTimeout(() => {
      this.dropzone = this.dropComponent.directiveRef.dropzone();
      for (let key in this.home.images) {
        let value = this.home.images[key];
        var mockFile = { name: value.imageName, size: Math.floor(Math.random() * 99999) };
        this.dropzone.emit("addedfile", mockFile);
        this.dropzone.emit("thumbnail", mockFile, value.imageUrl);
        this.dropzone.emit("complete", mockFile);
        this.dropzone.options.maxFiles--;
        $(".dz-image").children("img").addClass("h-100")
        $(document).ready(function () {
          $('[class="dz-remove"]').each(function (i, v) {
            var text = $(v).text();
            var new_text = text.replace("Remove file", "Borrar");
            $(v).text(new_text);
          });
        });
        var labeldz = <HTMLElement>document.getElementsByClassName('dz-remove')[key];
        labeldz.style.color = 'hsl(217, 71%, 53%)';
      }
      this.dropzoneMessage = 'Pulse o arrastre sus imágenes para subirlas ' + this.dropzone.options.maxFiles + ' disponibles';
    }, 1000);
  }

  updateHome() {
    this.showLoading = true;
    // servicios
    this.home.colegios = JSON.stringify(this.colegio);
    this.home.universidades = JSON.stringify(this.universidad);
    this.home.supermercados = JSON.stringify(this.mercados);
    this.home.metro = JSON.stringify(this.metro);
    this.home.bus = JSON.stringify(this.autobus);
    this.home.aeropuerto = JSON.stringify(this.aeropuerto);
    this.home.distanciaAlMar = JSON.stringify(this.beach);
    if (!this.home.bajoOplantabaja) {
      if (this.home.piso && this.home.plantaMasAlta) {
        var aux = this.home.piso + "/" + this.home.plantaMasAlta;
        this.home.piso = aux;
      }
    } else {
      this.home.piso = null;
      this.home.plantaMasAlta = null;
    }
    if (this.homeDto.aseoEnsuite) {
      if (this.homeDto.aseoEnsuite == '5+') {
        this.home.aseoEnsuite = 6;
      } else {
        this.home.aseoEnsuite = +this.homeDto.aseoEnsuite;
      }
    }
    // cajas del piso
    if (this.home.piso) {
      if (this.homeDto.piso != this.home.piso.split('/')[0] || this.homeDto.plantaMasAlta != this.home.piso.split('/')[1]) {
        this.home.piso = this.homeDto.piso + '/' + this.homeDto.plantaMasAlta;
      }
    }
    // antiguedad
    if (this.yearAntiguedad && this.yearAntiguedad.toISOString().length > 10) {
      this.home.antiguedad = +this.yearAntiguedad.toString().substring(11, 15);
    }
    // fin de obra
    if (this.yearFindeObra && this.yearFindeObra.toISOString().length > 10) {
      this.home.finDeObra = +this.yearFindeObra.toString().substring(11, 15);
    }
    // perform views
    if (this.home.vistasDespejadas) {
      var auxViews = JSON.stringify(this.preSelectedViews).split('[').join('').split(']').join('').split('"').join('').split("'").join('');
      if (auxViews.length != this.home.vistasDespejadas.length) {
        this.home.vistasDespejadas = JSON.stringify(this.preSelectedViews).split('[').join('').split(']').join('').split('"').join('').split("'").join('');
      }
    }
    // perform types
    if (this.home.tipos) {
      var auxTypes = JSON.stringify(this.preSelectedTypes).split('[').join('').split(']').join('').split('"').join('').split("'").join('');
      if (auxTypes.length != this.home.tipos.length) {
        this.home.tipos = JSON.stringify(this.preSelectedTypes).split('[').join('').split(']').join('').split('"').join('').split("'").join('');
      }
    }
    // variación de precios
    if (this.home.precioFinal && (this.home.precioFinal != this.homeDto.precioFinal) && !this.home.precioInicial) { // si se ha modificado el precio de venta
      this.home.precioInicial = this.homeDto.precioFinal;
    }
    if (this.home.precioAlquiler && ((this.home.precioAlquiler != this.homeDto.precioAlquiler) && !this.home.precioAlquilerInicial)) { // si se ha modificado el precio de alquiler
      this.home.precioAlquilerInicial = this.homeDto.precioAlquiler
    }
    // modelo de propiedad
    this.home.model = this.defineModel(this.home.tipo);
    // imágenes nuevas
    this.selectedFiles = this.dropComponent.directiveRef.dropzone().files;
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i]) {
          const body = new FormData();
          body.append('image', this.selectedFiles[i]);
          this.subscriptions.push(Axios.post(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${this.selectedFiles[i].name}`, body, {
            onUploadProgress: progressEvent => {
              if (progressEvent.loaded === progressEvent.total) {
                this.fileStatus.current++
              }
              // save the individual file's progress percentage in object
              this.fileProgress[this.selectedFiles[i].name] = progressEvent.loaded * 100 / progressEvent.total
              // sum up all file progress percentages to calculate the overall progress
              let totalPercent = this.fileProgress ? Object.values(this.fileProgress).reduce((sum, num) => sum + num, 0) : 0
              // divide the total percentage by the number of files
              this.fileStatus.percentage = Math.round(totalPercent / this.fileStatus.total)
              //this.value = this.value + Math.floor(Math.random() * 10) + 1;
              /*var percentComplete = progressEvent.loaded / progressEvent.total
              this.progress = (percentComplete * 100);
              console.log(this.progress);*/
            }
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
                // se añaden las nuevas al array de las que ya estaban
                _.map(this.images, (x) => {
                  this.home.images.push(x);
                });
                this.home.imagesAsString = JSON.stringify(this.home.images);
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
    // certificado energético
    if (this.tempEnergyUpdate != null) {
      const body = new FormData();
      body.append('image', this.tempEnergyUpdate);
      this.subscriptions.push(this.imageService.uploadSignature(body, this.tempEnergyUpdate.name)
        .subscribe({
          next: (res: any) => {
            var energyCert: HomeImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            this.home.energyCertAsString = JSON.stringify(energyCert);
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, `Certificado energético: algo salio mal. Por favor intentelo pasados unos minutos.` + err);
            this.showLoading = false;
          }
        }));
    }
    setTimeout(() => {
      switch (this.home.model) {
        case 'Flat':
          this.subscriptions.push(this.homeService.updateFlat(this.home).subscribe({
            next: () => {
              this.showLoading = false;
              this.notificationService.notify(NotificationType.SUCCESS, `Actualizado`);
              setTimeout(() => {
                this.clickButton('goBackSidenav');
              }, 600);
              this.ngOnInit();
            },
            error: () => {
              this.notificationService.notify(NotificationType.ERROR, `Error. Vuelva a intentarlo pasados unos minutos.`);
            }

          }));
          break;
        case 'House':
          this.subscriptions.push(this.homeService.updateHouse(this.home).subscribe({
            next: () => {
              this.showLoading = false;
              this.notificationService.notify(NotificationType.SUCCESS, `Actualizado`);
              setTimeout(() => {
                this.clickButton('goBackSidenav');
              }, 600);
              this.ngOnInit();
            },
            error: () => {
              this.notificationService.notify(NotificationType.ERROR, `Error. Vuelva a intentarlo pasados unos minutos.`);
            }

          }));
          break;
        case 'Room':
          this.subscriptions.push(this.homeService.updateRoom(this.home).subscribe({
            next: () => {
              this.showLoading = false;
              this.notificationService.notify(NotificationType.SUCCESS, `Actualizado`);
              setTimeout(() => {
                this.clickButton('goBackSidenav');
              }, 600);
              this.ngOnInit();
            },
            error: () => {
              this.notificationService.notify(NotificationType.ERROR, `Error. Vuelva a intentarlo pasados unos minutos.`);
            }

          }));
          break;
        case 'NewProject':
          this.subscriptions.push(this.homeService.updateNewProject(this.home).subscribe({
            next: () => {
              this.showLoading = false;
              this.notificationService.notify(NotificationType.SUCCESS, `Actualizado`);
              setTimeout(() => {
                this.clickButton('goBackSidenav');
              }, 600);
              this.ngOnInit();
            },
            error: () => {
              this.notificationService.notify(NotificationType.ERROR, `Error. Vuelva a intentarlo pasados unos minutos.`);
            }

          }));
          break;

        default:
          break;
      }
    }, 3000);
  }

  public onRemoveEdit(e: any) {
    if (this.home.images) {
      this.home.images.forEach((item, index) => {
        if (item.imageName == e.name) this.home.images.splice(index, 1);
      })
    }
    this.dropzone.options.maxFiles++;
  }

  closeSidenav() {
    this.stateTextfields = Array.from({ length: 4 }, () => new Array(6).fill(false));
    if (this.dropComponent) {
      this.dropComponent.directiveRef.reset();
      $(".dz-wrapper").empty();
    }
    this.dropzone.options.maxFiles = 60;
  }

  restoreMapEdit() {
    if (this.mapEvents.has('control')) {
      this.map3.eachLayer(function (layer) {
        layer.remove();
      });
      Jawg_Sunny().addTo(this.map3);
      this.mapEvents.delete('control');
      this.markerHouse = new L.marker(this.waypointsFrom, {
        draggable: false,
        icon: homeicon,
      });
      this.markerHouse.addTo(this.map3);
    }
  }

  clearService(flag: string, index: number) {
    if (flag == 'colegio') {
      this.colegio[index] = { lat: '', lng: '', nombre: '', ensenyanza: '', institucion: '', web: '', distancia: '', tiempo: '', };
      this.stateTextfields[0][index] = false;
    } else if (flag == 'universidad') {
      this.universidad[index] = { lat: '', lng: '', nombre: '', rama: '', institucion: '', web: '', distancia: '', tiempo: '', };
      this.stateTextfields[1][index] = false;
    } else if (flag == 'mercados') {
      this.mercados[index] = { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' };
      this.stateTextfields[2][index + 3] = false;
    } else if (flag == 'autobus') {
      this.autobus[index] = { lat: '', lng: '', parada: '', lineas: '', distancia: '', tiempo: '' };
      this.stateTextfields[2][index] = false;
    } else if (flag == 'metro') {
      this.metro[index] = { lat: '', lng: '', parada: '', lineas: '', distancia: '', tiempo: '' };
      this.stateTextfields[3][0] = false;
    } else if (flag == 'aeropuerto') {
      this.aeropuerto[index] = { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' };
      this.stateTextfields[3][1] = false;
    } else if (flag == 'playa') {
      this.beach[index] = { lat: '', lng: '', nombre: '', distancia: '', tiempo: '' }
      this.stateTextfields[3][2] = false;
    }
  }

  deleteHome(home: Home) {
    Swal.fire({
      title: "Seguro?",
      text: "Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8093f1",
      cancelButtonColor: "#ee7272",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, Borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        var homeId = home.viviendaId;
        this.subscriptions.push(this.homeService.deleteHome(home.id).subscribe({
          next: (res: any) => {
            this.notificationService.notify(NotificationType.INFO, 'Anuncio borrado')
            localStorage.removeItem('currentBuilding');
            this.user.domains.forEach((item, index) => {
              if (item.viviendaId == homeId) this.user.domains.splice(index, 1);
            })
          },
          error: (error: any) => {
            this.notificationService.notify(NotificationType.ERROR, error.message);
          }
        }))
      }
    });
  }

  highlightHome() {

  }

  showHome(home: Home) {
    if (home) {
      this.homeService.addHomeToLocalCache(home);
      this.routerLinkId = +home.id;
      this.routerLinkModel = home.model;
      /*setTimeout(() => {
        $('#linkPopup').trigger('click');
      }, 100);*/

      setTimeout(() => {
        this.clickButton('linkPopup');
      }, 100);

    }
  }

  date: Date;
  formatChatDate(timestamp: string): any {
    var newDate = new Date(timestamp);
    var options = {
      locale: es,
      addSuffix: true
    };
    if (this.date == null || this.date == undefined) {
      this.date = new Date(timestamp);
      return formatDistance(this.date, Date.now(), options);
    } else if (this.date.toLocaleString().split('')[0] != newDate.toLocaleString().split('')[0]) {
      this.date = newDate;
      return formatDistance(newDate, Date.now(), options);
    } else {
      return
    }
  }

  formatChatHourPopup(timestamp: string): string {
    var hora = timestamp.substring(11, 16);
    return hora;
  }

  ngOnInit(): void {
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });
    initFlowbite();
    //this.startChatConnection();
    // apaño temporal para probar el chat. Luego se añaden onclick en el anuncio
    // y se borran desde la interfaz
    this.subscriptions.push(this.userService.getUsers().subscribe({
      next: (res: User[]) => {
        res = res.filter(user => user.userId != this.user.userId)
        this.user.chatsOpened = [...res];
        //console.log(this.user.chatsOpened[0].profileImage.imageUrl);
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, `No se ha podido enviar el mensaje. Intentelo pasados unos minutos.` + err);
      }
    }));
    this.primengConfig.ripple = true;
    this.loadScripts();
    this.user = this.authenticationService.getUserFromLocalCache();
    this.brandingColor = this.sanitizer.bypassSecurityTrustStyle(this.user.color);

    for (let i = 0; i < cssPathUserPro.length; i++) {
      this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
      this.renderer2.appendChild(this.document.head, this.styleUser[i]);
      this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
      this.renderer2.setProperty(this.styleUser[i], 'href', cssPathUserPro[i]);
    }
    this.getOwnHomes()
    this.getFavourites();
    this.setCardLike()
  }

  public getOwnHomes() {
    this.homeService.getHomesByQuery('IdCreador@=*' + this.user.userId).subscribe({
      next: (res: Home[]) => {
        if (res) {
          this.user.domains = [...res]
          for (let i = 0; i < res.length; i++) {
            this.user.domains[i] = this.homeService.performHome(this.user.domains[i]);
          }
        }
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, 'Error al cargar las viviendas' + err);
      }
    });
  }

  userFavourites: Home[] = [];
  public getFavourites() {
    this.homeService.getHomesByQuery('LikeMeForeverAsString@=*' + this.user.userId).subscribe({
      next: (res: Home[]) => {
        if (res) {
          this.userFavourites = [...res]
          for (let i = 0; i < res.length; i++) {
            this.userFavourites[i] = this.homeService.performHome(this.userFavourites[i]);
          }
        }
      },
      error: (err: any) => {
        this.notificationService.notify(NotificationType.ERROR, 'Error al cargar los favoritos' + err);
      }
    });
  }

  // nzMessages
  createMessage(type: string, content: string): void {
    this.nzMessage.create(type, content, {});
  }

  cuoreLike(home: Home) {
    if (this.state) {
      var selectedHome = home;
      var userValue = this.user.userId;
      if (selectedHome.likeMeForever.includes(userValue)) {
        selectedHome.likeMeForever.forEach((item, index) => {
          if (item == userValue) selectedHome.likeMeForever.splice(index, 1);
        });
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: () => {
            this.createMessage("success", "Borrado desde favoritos");
            //this.createMessage("success", "Borrado desde favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      } else {
        selectedHome.likeMeForever.push(userValue);
        selectedHome.likeMeForeverAsString = selectedHome.likeMeForever.toString();
        this.subscriptions.push(this.homeService.updateHome(selectedHome).subscribe({
          next: () => {
            this.createMessage("success", "Guardado en favoritos");
            //this.createMessage("success", "Guardado en favoritos");
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, err);
          }
        }));
      }
    }
  }

  @ViewChildren('redheartcheckbox') likes4ever: QueryList<ElementRef>
  setCardLike() {
    setTimeout(() => {
      if (this.state) {
        this.likes4ever.forEach(f => {
          const doc = document.getElementById(f.nativeElement.id) as HTMLInputElement;
          doc.checked = true;
        });
      }
    }, 500);
  }

  loadScripts() {
    for (let i = 0; i < dynamicUserProScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicUserProScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  updateUser() {
    this.showLoading = true;
    if (this.tempBranding != null) {
      const body = new FormData();
      //var randomString = (Math.random() + 1).toString(36).substring(10);
      body.append('image', this.tempBranding);
      this.subscriptions.push(this.imageService.uploadSignature(body, this.tempBranding.name)
        .subscribe({
          next: (res: any) => {
            this.user.brandImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            console.log(res);
            this.user.brandImageAsString = JSON.stringify(this.user.brandImage);
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, `Imagen corporativa: algo salio mal. Por favor intentelo pasados unos minutos.` + err);
            this.brandImageRefreshing = false;
          }
        }));
    }
    // user profile file
    if (this.tempProfile != null) {
      const body = new FormData();
      body.append('image', this.tempProfile);
      this.subscriptions.push(this.imageService.uploadSignature(body, this.tempProfile.name,)
        .subscribe({
          next: (res: any) => {
            this.user.profileImage = {
              imageId: res.data.data.id,
              imageName: res.data.data.title,
              imageUrl: res.data.data.url,
              imageDeleteUrl: res.data.data.delete_url
            }
            //this.reportUploadProgress(res);
            console.log(res);
            this.user.profileImageAsString = JSON.stringify(this.user.profileImage);
            this.imageProfileRefreshing = false;
          },
          error: (err: any) => {
            this.imageProfileRefreshing = false;
            console.log(err);
          }
        }));
    }
    this.user.username = this.user.firstname + ' ' + this.user.lastname
    setTimeout(() => {
      this.subscriptions.push(this.userService.updateUser(this.user, this.user.id).subscribe({
        next: (res: User) => {
          this.user = this.userService.performUser(res);
          this.authenticationService.addUserToLocalCache(res);
          console.log(this.user);
          this.getOwnHomes();
          this.getFavourites();
          setTimeout(() => { this.tunedHomesAfterUpdateUser(); }, 1000)
          this.notificationService.notify(NotificationType.SUCCESS, `Se ha actualizado el perfil`);
        },
        error: (err: any) => {
          console.log(err);
        }
      }));
    }, 1000);
    this.showLoading = false;
  }

  tunedHomesAfterUpdateUser() {
    if (this.user.brandImageAsString && this.user.color && this.user.isPro) {
      _.map(this.user.domains, (x) => {
        x.proColor = this.user.color;
        x.proImageAsString = this.user.brandImageAsString;
        x.nombreCreador = this.user.username;
        this.subscriptions.push(this.homeService.updateHome(x).subscribe({
          next: (res) => {
            this.notificationService.notify(NotificationType.SUCCESS, `vivienda tuneada con id: ` + res.viviendaId);
          },
          error: (err: any) => {
            this.notificationService.notify(NotificationType.ERROR, `error al tunear la vivienda` + err);
          }
        }));
      })
    }
  }

  // update city form
  showCityResult() {
    if (this.home.ciudad == null) {
      alert('Introduzca la provincia!');
    } else {
      this.home.ciudad = this.home.ciudad.split(' ')[0].replace(',', '');
      this.closeDialog();
    }
  }

  locationMap(houseType: string) {
    this.showDialog();
    if (houseType == 'homes') {
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
          //this.getLocation();
          Stadia_OSMBright().addTo(this.map2);
          this.map2.addControl(search);
        }, 300)
      }
    } else if (houseType == 'projects') {
      if (this.map4 == null || this.map4 == undefined) {
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
          var x = document.getElementById('map_4');
          x.style.display = 'flex';
          this.map4 = L.map('map_4', { renderer: L.canvas() }).setView(
            [40.4380986, -3.8443428],
            5
          );
          //this.getLocation();
          Stadia_OSMBright().addTo(this.map4);
          this.map4.addControl(search);
        }, 300)
      }
    }
  }

  checkBox(param): any {
    //console.log(param)
    //setTimeout(() => { console.log(this.home.aireAcondicionado) }, 1000);

  }

  ngOnDestroy(): void {
    for (let i = 0; i < cssPathUserPro.length; i++) {
      this.renderer2.removeChild(this.document.head, this.styleUser[i]);
    }
    this.styleUser = [];
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
