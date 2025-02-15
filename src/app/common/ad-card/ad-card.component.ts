import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Lightbox } from 'ngx-lightbox';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { Home } from 'src/app/model/home';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ChatService } from 'src/app/service/chat.service';
import { EmailService } from 'src/app/service/email.service';
import { HomeService } from 'src/app/service/home.service';
import { ImageService } from 'src/app/service/image.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import slug from 'slug'
import { AddComponent } from 'src/app/pages/add/add.component';
import { NotificationType } from 'src/app/class/notification-type.enum';

@Component({
  selector: 'app-ad-card',
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.css',
  standalone: false,
})
export class AdCardComponent extends AddComponent implements OnInit, OnDestroy {

  @Input() homeCard: Home;
  @Input() carouselIdx: number;
  @Input() user: User;
  @Input() cardSkeletonOn: boolean = false;
  @Input() anyPopupOpen: boolean;
  @Input() popupOpenViviendaId: string;
  @Input() cardCheckedViviendaId: string;
  @Input() parent: string;

  constructor(
    @Inject(DOCUMENT) document: Document,
    renderer2: Renderer2,
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    protected homeService: HomeService,
    protected _lightbox: Lightbox,
    primeng: PrimeNG,
    messageService: MessageService,
    protected chatService: ChatService,
    sanitizer: DomSanitizer,
    modalServiceBs: BsModalService,
    nzMessage: NzMessageService,
    modalService: NgbModal,
    imageService: ImageService,
    protected notification: NzNotificationService,
    protected emailService: EmailService,
    protected breakpointObserver: BreakpointObserver,
  ) {
    super(
      document,
      renderer2,
      router,
      authenticationService,
      userService,
      notificationService,
      route,
      toastr,
      homeService,
      _lightbox,
      primeng,
      messageService,
      chatService,
      sanitizer,
      modalServiceBs,
      nzMessage,
      modalService,
      imageService,
      notification,
      emailService,
      breakpointObserver
    );

  }

  ngOnInit() {
  }

  runAdCard(home: Home) {
    if (home) {
      var slugFest = home.tipo + '-' + home.calle + '-' + home.distrito + '-' + home.ciudad;
      this.routerLinkQueryParams = slug(slugFest, '-');
      //this.router.navigate(['/add', home.id], { queryParams: { slugFest },fragment: home.model});
      this.router.navigate([]).then(() => {
        window.open('/add/' + home.id + '?' + slugFest + '#' + home.model, '_blank');
      });
    }
  }

  isCyclic(obj): any {
    const keys = []
    const stack = []
    const stackSet = new Set()
    let detected = false

    const detect = ((object, key) => {
      if (!(object instanceof Object))
        return

      if (stackSet.has(object)) { // it's cyclic! Print the object and its locations.
        const oldindex = stack.indexOf(object)
        const l1 = `${keys.join('.')}.${key}`
        const l2 = keys.slice(0, oldindex + 1).join('.')
        console.log(`CIRCULAR: ${l1} = ${l2} = ${object}`)
        console.log(object)
        detected = true
        return
      }

      keys.push(key)
      stack.push(object)
      stackSet.add(object)
      Object.keys(object).forEach(k => { // dive on the object's children
        if (k && Object.prototype.hasOwnProperty.call(object, k))
          detect(object[k], k)
      })

      keys.pop()
      stack.pop()
      stackSet.delete(object)
    })

    detect(obj, 'obj')
    return detected
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

