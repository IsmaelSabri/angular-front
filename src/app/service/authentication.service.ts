import { Rol } from '../class/role.enum';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();
  private httpHeaders=new HttpHeaders({'Content-Type':"application/json"})

  constructor(private http: HttpClient) {}

  public login(user: Usuario): Observable<HttpResponse<Usuario>> {
    return this.http.post<Usuario>(`${this.host}/api/v1/auth/login`, user, { observe: 'response' });
  }

  public register(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.host}/api/v1/auth/register`, user, {headers:this.httpHeaders}); //{headers:this.httpHeaders}
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: Usuario): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): Usuario {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== ''){
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }
  }

}
