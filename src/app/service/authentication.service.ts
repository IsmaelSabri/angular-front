import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../class/TokenApiModel';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private refreshToken: string;
  private jwtHelper = new JwtHelperService();
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ',
  });

  constructor(private http: HttpClient) {}

  public login(user: User): Observable<any> {
    return this.http.post<User>(`${this.host}/api/user/login`, user, {
      observe: 'response',
    });
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/api/user/new`, user, {
      headers: this.httpHeaders,
    }); 
  }

  public renewToken(tokenApi: TokenApiModel) {
    return this.http.post<TokenApiModel>(`${this.host}/api/user/refresh`,
      tokenApi
    );
  }

  public logOut(): void {
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public saveRefreshToken(token: string): void {
    this.refreshToken = token;
    localStorage.setItem('refreshToken', token);
  }

  public decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  public isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}
