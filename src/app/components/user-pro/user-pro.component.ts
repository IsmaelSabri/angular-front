import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-pro',
  templateUrl: './user-pro.component.html',
  styleUrl: './user-pro.component.css'
})
export class UserProComponent extends UserComponent implements OnInit, OnDestroy{

  constructor(
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    protected modalService: BsModalService,
    @Inject(DOCUMENT) protected document: Document,
  ) {
    super(
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr,
      document,
      renderer2
    );
  }
  protected styleUser: HTMLLinkElement[]=[];

    ngOnInit(): void {
    this.loadScripts();
    this.user = this.authenticationService.getUserFromLocalCache();
    const cssPath = [
    '../../../assets/css/bootstrap.min.css',
    'https://cdn.quilljs.com/1.3.6/quill.snow.css',
    '../../../assets/css/user-pro-style/shards-dashboards.1.1.0.min.css', 
    '../../../assets/css/user-pro-style/extras.1.1.0.min.css',
    '../../../assets/css/user-pro-style/shards-dashboards.1.1.0.css',
    '../../../assets/css/user-pro-style/danger.1.1.0.css',
    '../../../assets/css/user-pro-style/danger.1.1.0.min.css',
    '../../../assets/css/user-pro-style/success.1.1.0.css',
    '../../../assets/css/user-pro-style/info.1.1.0.css',
    '../../../assets/css/user-pro-style/info.1.1.0.min.css',
    '../../../assets/css/user-pro-style/secondary.1.1.0.css',
    '../../../assets/css/user-pro-style/secondary.1.1.0.min.css',
    '../../../assets/css/user-pro-style/success.1.1.0.min.css',
    '../../../assets/css/user-pro-style/warning.1.1.0.css',
    '../../../assets/css/user-pro-style/warning.1.1.0.min.css',
    '../../../assets/css/user-pro-style/scss/_alert.scss',
    '../../../assets/css/user-pro-style/scss/_badge.scss',
    '../../../assets/css/user-pro-style/scss/_button-group.scss',
    '../../../assets/css/user-pro-style/scss/_buttons.scss',
    '../../../assets/css/user-pro-style/scss/_card.scss',
    '../../../assets/css/user-pro-style/scss/_custom-forms.scss',
    '../../../assets/css/user-pro-style/scss/_custom-sliders.scss',
    '../../../assets/css/user-pro-style/scss/_dropdown.scss',
    '../../../assets/css/user-pro-style/scss/_icons.scss',
    '../../../assets/css/user-pro-style/scss/_images.scss',
    '../../../assets/css/user-pro-style/scss/_input-group.scss',
    '../../../assets/css/user-pro-style/scss/_list-group.scss',
    '../../../assets/css/user-pro-style/scss/_navbar.scss',
    '../../../assets/css/user-pro-style/scss/_overrides.scss',
    '../../../assets/css/user-pro-style/scss/_reboot.scss',
    '../../../assets/css/user-pro-style/scss/_utilities.scss',
    '../../../assets/css/user-pro-style/scss/_variables.scss',
    '../../../assets/css/user-pro-style/scss/shards-dashboards.scss'
   ];
    for (let i = 0; i < cssPath.length; i++) {
      this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
      this.renderer2.appendChild(this.document.head, this.styleUser[i]);
      this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
      this.renderer2.setProperty(this.styleUser[i], 'href', cssPath[i]);
    }
    }
    ngOnDestroy(): void {
    }


    loadScripts() {
    const dynamicScripts = [
      'https://buttons.github.io/buttons.js',
      'https://cdn.quilljs.com/1.3.6/quill.js',
      'https://code.jquery.com/jquery-3.7.1.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.10.2/umd/popper.min.js',
      '../../../assets/js/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js',
      'https://unpkg.com/shards-ui@latest/dist/js/shards.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Sharrre/2.0.1/jquery.sharrre.min.js',
      '../../../assets/js/user-pro-dashboard/extras.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/shards-dashboards.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/shards-dashboards.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-overview.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-overview.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/app-components-overview.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/app/app-components-overview.1.1.0.min.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-new-post.1.1.0.js',
      '../../../assets/js/user-pro-dashboard/app/app-blog-new-post.1.1.0.min.js',
      //'../../../assets/js/bootstrap.bundle.min.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

}
