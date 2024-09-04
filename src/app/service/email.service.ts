import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpResponse } from '../model/performance/custom-http-response';
@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private host = environment.apiUrl;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8',
  });

  constructor(private http: HttpClient) { }

  public EmailMessage(contactUser: string): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/api/email/email-contact`, contactUser, {
      headers: this.httpHeaders,
    });
  }
}
