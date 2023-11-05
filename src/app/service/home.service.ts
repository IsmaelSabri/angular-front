import { Home } from '../model/home';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import Axios from 'axios-observable';
import { APIKEY } from 'src/environments/environment.prod';
import { CustomHttpResponse } from '../model/performance/custom-http-response';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private property$: ReplaySubject<Home> = new ReplaySubject<Home>();
  public vivienda_: Observable<Home> = this.property$.asObservable();
  private host = environment.apiUrl;
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8',
  });
  constructor(private http: HttpClient) {}

  /*  Reservado para emitir nuevos valores
  get selectedHome$(): Observable<Home>{ // :Observable<Home>
    return this.property_;
  }

  setHome$(property:Home):void{
    this.property$.next(property);
  }*/

  /*public uploadImage(file:File): Observable<CustomHttpResponse>{
    const body = new FormData();
    body.append('image',);
    return this.http.post<FormData>(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${this.foto.name}`,file);
  }*/

  public addHome(home: string): Observable<Home> {
    return this.http.post<Home>(`${this.host}/api/home/new`, home, {
      headers: this.httpHeaders,
    });
  }

  public getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(`${this.host}/api/home/all`);
  }

  public addHomesToLocalCache(properties: Home[]): void {
    localStorage.setItem('properties', JSON.stringify(properties));
  }

  public getHomeFromLocalCache(): Home {
    if (localStorage.getItem('currentBuilding')) {
      return JSON.parse(localStorage.getItem('currentBuilding'));
    }
    return null;
  }

  public getHomesFromLocalCache(): Home[] {
    if (localStorage.getItem('properties')) {
      return JSON.parse(localStorage.getItem('properties'));
    }
    return null;
  }
}
