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
import { HomeComponent } from 'src/app/home/home.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent extends HomeComponent implements OnInit, OnDestroy {
  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    homeService: HomeService,
    sanitizer: DomSanitizer
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr,
      homeService,
      sanitizer
    );
  }

  ngOnInit(): void {
    if(!this.isEmptyArray(this.homes)){
      this.subscriptions.push(
        this.homeService.getHomes().subscribe((response: Home[]) => {
          this.homeService.addHomesToLocalCache(response);
          this.homes = response;
          this.refreshing = false;    
          console.log(JSON.stringify(this.homes));
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSelectedHome(house: Home) {
    console.log('now we are running');
  }
}
