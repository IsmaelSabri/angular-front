import { Component, OnDestroy, Inject, OnInit, Renderer2 } from '@angular/core';
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
import { DOCUMENT } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NzAlign, NzJustify } from 'ng-zorro-antd/flex';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent extends HomeComponent implements OnInit, OnDestroy {
  private style?: HTMLLinkElement;
  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    homeService: HomeService,
    sanitizer: DomSanitizer,
    modalServiceBs: BsModalService,
    @Inject(DOCUMENT) document: Document,
    renderer2: Renderer2,
    primengConfig: PrimeNGConfig,
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
      
    );
  }

  public cssPath = '../../../assets/css/style.css';

  public justifySegment: NzJustify[] = [
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly'
  ];
  public alignSegment: NzAlign[] = ['flex-start', 'center', 'flex-end'];
  ngOnInit(): void {
    this.style = this.renderer2.createElement('link') as HTMLLinkElement;
    this.renderer2.appendChild(this.document.head, this.style);
    this.renderer2.setProperty(this.style, 'rel', 'stylesheet');
    this.renderer2.setProperty(this.style, 'href', this.cssPath);
    this.loadScripts();
    if (!this.isEmptyArray(this.homes)) {
      this.subscriptions.push(
        this.homeService.getHomes().subscribe((response) => {
          response.map((Home) => {
            Home.images = JSON.parse(Home.imagesAsString);
          });
          //this.homeService.addHomesToLocalCache(response);
          this.homes = response;
          this.refreshing = false;
        })
      );
    }
  }

  printLog(){
    console.log("funciona");
  }

  loadScripts() {
    const dynamicScripts = [
      '../../../assets/js/script.js',
      '../../../assets/js/script.min.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.style=null;
    this.renderer2.removeChild(this.document.head, this.style);
  }

  onSelectedHome(house: Home) {
    console.log('now we are running');
  }
}
