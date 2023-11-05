import { HomeService } from 'src/app/service/home.service';
import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { NotificationService } from '../../service/notification.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
//import 'rxjs/Rx';
import { Home } from '../../model/home';
import { ToastrService } from 'ngx-toastr';
import { Fancied } from 'src/app/model/fancied';
import { ContactUser } from 'src/app/model/contact-user';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent extends UserComponent implements OnInit, OnDestroy{

  fancied: Fancied=new Fancied();
  aux:string;
  public refreshing: boolean;
  contactUser:ContactUser=new ContactUser();

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    private homeService: HomeService,
    private _lightbox: Lightbox,
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

  home:Home=this.homeService.getHomeFromLocalCache();

  public contactMessage(){
    this.refreshing=true;
    const formData = new FormData();
    formData.append('nombre',this.contactUser.userName);
    formData.append('correo',this.contactUser.mail);
    formData.append('telefono',this.contactUser.phone);
    formData.append('mensaje',this.contactUser.msg);
    alert("Mensaje enviado! \n La respuesta del vendedor será enviada a tu correo electrónico!");
    this.subscriptions.push(
     /*
     hay que implementar el envio del correo:
     - en el servicio 
     - en el backend
     - aquí
     
     this.markerService.addBuilding(formData).subscribe((res) => {
        this.router.navigate(['/home']),
          this.sendNotification(NotificationType.SUCCESS, ` Mensaje enviado.`);
        var resetForm = <HTMLFormElement>document.getElementById('contactForm');
        resetForm.reset();
        this.clickButton('contact-form-close');
      })*/
    );

  }

_albums:any = [];
  ngOnInit(): void {
    this.home=JSON.parse(localStorage.getItem("currentBuilding"));
    setTimeout(()=>{
      for (let i = 0; i <this.home.images.length; i++) {
        const src = this.home.images[i].imageUrl + i + '.jpg';
        const caption = i + ' / ' + this.home.images.length;
        const thumb = this.home.images[i].imageUrl + i + '.jpg';
        const album = {
           src: src,
           caption: caption,
           thumb: thumb
        };
        this._albums.push(album);
      }
    },1000);
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }

  submitHouseDetails() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }


}
