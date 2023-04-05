import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { NotificationService } from '../../service/notification.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UsuarioService } from '../../service/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { Property } from '../../model/property';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from 'src/app/service/property.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends UserComponent implements OnInit, OnDestroy{

  public properties: Property[];

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UsuarioService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    public propertyService:PropertyService
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

  ngOnInit(): void {
      
  }

  public getBuildings(): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.propertyService.getBuildings().subscribe(
        (response: Property[]) => {
          this.propertyService.addBuildingsToLocalCache(response);
          this.properties = response;
          this.refreshing = false;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSelectedProperty(property:Property){
    console.log('now we are running');
  }

}
