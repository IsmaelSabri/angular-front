import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { NotificationService } from '../../service/notification.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
//import 'rxjs/Rx';
import { Home } from '../../model/home';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/service/home.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent extends UserComponent implements OnInit, OnDestroy {
  public homes: Home[];

  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    homeService: HomeService
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

  ngOnInit(): void {}

  /*public getBuildings(): void {
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
  }*/

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSelectedHome(house: Home) {
    console.log('now we are running');
  }
}
