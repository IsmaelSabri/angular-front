import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { NotificationService } from '../../service/notification.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UsuarioService } from '../../service/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { Property } from '../../model/property';
import { ToastrService } from 'ngx-toastr';
import { Edificio } from './../../model/edificio';
import { Fancied } from 'src/app/model/fancied';
import { ContactUser } from 'src/app/model/contact-user';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent extends UserComponent implements OnInit, OnDestroy{

  edificio:Edificio=new Edificio();
  fancied: Fancied=new Fancied();
  aux:string;
  public refreshing: boolean;
  contactUser:ContactUser=new ContactUser();

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UsuarioService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
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


  ngOnInit(): void {
    this.edificio=JSON.parse(localStorage.getItem("currentBuilding"));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }


}
