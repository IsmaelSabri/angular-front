import { Component, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../../service/chat.service';
import { Message } from 'src/app/model/message';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/model/user';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { UserComponent } from '../user/user.component';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { NotificationService } from 'src/app/service/notification.service';
import "deep-chat";

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css'],
})
export class PrivateChatComponent extends UserComponent implements OnInit, OnDestroy {
  @Input() toUser = ''; // userId destino
  content: string = ''; // mensaje para enviar
  sellerUser: User;

  @ViewChild('messageForm') messageForm: NgForm | undefined;
  @Input() messages: Message[] = this.chatService.privateMessages;
  constructor(
    router: Router,
    authenticationService: AuthenticationService,
    userService: UserService,
    notificationService: NotificationService,
    route: ActivatedRoute,
    toastr: ToastrService,
    @Inject(DOCUMENT) document: Document,
    renderer2: Renderer2,
    primengConfig: PrimeNGConfig,
    public activeModal: NgbActiveModal,
    public chatService: ChatService
  ) {
    super(router, authenticationService, userService, notificationService, route, toastr, document,
      renderer2, primengConfig);
  }
  ngOnDestroy(): void {
    this.chatService.closePrivateChatMessage(this.toUser);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userService.getUserByUserId(this.toUser).subscribe({
      next: (res) => {
        this.sellerUser = res;
      }, error: () => {
        this.sendNotification(
          NotificationType.ERROR, 'Propietario del anuncio desconocido',
        );
      }
    }));
    //this.sellerUser=
  }

  sendMessage() {
      this.chatService.sendPrivateMessage(this.toUser, this.content);
  }

}
