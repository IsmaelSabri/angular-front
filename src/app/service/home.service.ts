import { Home } from '../model/home';
import { EventEmitter, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { CustomHttpResponse } from '../model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private property$: ReplaySubject<Home>=new ReplaySubject<Home>();
  public vivienda_:Observable<Home>=this.property$.asObservable();
  private host = environment.apiUrl;
  private httpHeaders=new HttpHeaders({'Content-Type':"application/json"})
  constructor(private http: HttpClient) {}

  /*  Reservado para emitir nuevos valores
  get selectedHome$(): Observable<Home>{ // :Observable<Home>
    return this.property_;
  }

  setHome$(property:Home):void{
    this.property$.next(property);
  }*/


  public addHome(formData: FormData): Observable<Home>{
    return this.http.post<Home>(`${this.host}/api/home/new`, formData);
  }

  public getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(`${this.host}/api/home/all`);
  }

  public addHomesToLocalCache(properties: Home[]): void {
    localStorage.setItem('properties', JSON.stringify(properties));
  }

  public getHomesFromLocalCache(): Home[] {
    if (localStorage.getItem('properties')) {
      return JSON.parse(localStorage.getItem('properties'));
    }
    return null;
  }

}
