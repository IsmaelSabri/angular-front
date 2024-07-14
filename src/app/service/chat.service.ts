import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Chat } from '../model/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public host = environment.apiUrl;
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8',
  });

  constructor(private modalService: NgbModal, private http: HttpClient) { }

  public getChats(userFrom: string, userTo: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.host}/api/Chats/GetChats?userId=${userFrom}&toUserId=${userTo}`);
  }

  public sendMessage(msg: any): Observable<any> {
    return this.http.post<Chat>(`${this.host}/api/Chats/SendMessage`, msg, {
      headers: this.httpHeaders,
    });
  }

}
