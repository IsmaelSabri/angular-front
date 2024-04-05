import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Message } from '../model/message';
import { User } from '../model/user';
import { PrivateChatComponent } from '../components/private-chat/private-chat.component';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  myUserId: string;
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  //messages: Message[] = [];
  privateMessages: Message[] = [];
  privateMesageInitiated = false;

  constructor(private httpClient: HttpClient, private modalService: NgbModal, private authenticationService: AuthenticationService) {
    if (this.authenticationService.isUserLoggedIn()) {
      this.myUserId = this.authenticationService.getUserFromLocalCache().userId;
    }
  }

  /*public registerUser(user: User) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/chat/register-user`,
      user,
      { responseType: 'text' }
    );
  }*/

  /*this.chatConnection.on('NewMessage', (newMessage: Message) => {
  this.messages = [...this.messages, newMessage];
});*/

  /*public async sendMessage(content: string) {
    const message: Message = {
      from: this.myUserId,
      content,
    };

    return this.chatConnection
      ?.invoke('ReceiveMessage', message)
      .catch((error) => console.log(error));
  }*/

  public createChatConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat`)
      .withAutomaticReconnect()
      .build();
    this.chatConnection.start().catch((error) => {
      console.log(error);
    });

    // receiving commands from chathub
    this.chatConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });

    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];
    });

    this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMesageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });

    this.chatConnection.on('NewPrivateMessage', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      for(var i =0;i<this.privateMessages.length;i++){
        console.log(i + " mensaje de: " + this.privateMessages[i].from + " Para: " + this.privateMessages[i].from);
      }
    });

    this.chatConnection.on('CloseProivateChat', () => {
      //this.privateMesageInitiated = false;
      //this.privateMessages = [];
      this.modalService.dismissAll();
    });
  }

  public stopChatConnection() {
    this.chatConnection?.stop().catch((error) => console.log(error));
  }

  // Chathub method triggers comes here
  public async addUserConnectionId() {
    return this.chatConnection
      ?.invoke('AddUserConnectionId', this.myUserId)
      .catch((error) => console.log(error));
  }

  public async sendPrivateMessage(to: string, content: string) {
    const message: Message = {
      from: this.myUserId,
      to,
      content,
    };
    console.log('from: ' + this.myUserId + ' to: ' + to + ' content: ' + content);
    if (!this.privateMesageInitiated) {
      this.privateMesageInitiated = true;
      return this.chatConnection
        ?.invoke('CreatePrivateChat', message)
        .then(() => {
          this.privateMessages = [...this.privateMessages, message];
        })
        .catch((error) => console.log(error));
    } else {
      return this.chatConnection
        ?.invoke('RecivePrivateMessage', message)
        .catch((error) => console.log(error));
    }
  }

  public async closePrivateChatMessage(otherUser: string) {
    return this.chatConnection
      ?.invoke('RemovePrivateChat', this.myUserId, otherUser)
      .catch((error) => console.log(error));
  }
}
