import { Property } from '../model/property';
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
import { CustomHttpRespone } from '../model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private property$: ReplaySubject<Property>=new ReplaySubject<Property>();
  public vivienda_:Observable<Property>=this.property$.asObservable();
  private host = environment.apiUrl;
  private httpHeaders=new HttpHeaders({'Content-Type':"application/json"})
  constructor(private http: HttpClient) {}

  /*  Reservado para emitir nuevos valores
  get selectedProperty$(): Observable<Property>{ // :Observable<Property>
    return this.property_;
  }

  setProperty$(property:Property):void{
    this.property$.next(property);
  }*/


  public addBuilding(formData: FormData): Observable<Property>{
    return this.http.post<Property>(`${this.host}/properties/new`, formData);
  }

  public getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.host}/properties/list`);
  }

  public addPropertiesToLocalCache(properties: Property[]): void {
    localStorage.setItem('properties', JSON.stringify(properties));
  }

  public getPropertiesFromLocalCache(): Property[] {
    if (localStorage.getItem('properties')) {
      return JSON.parse(localStorage.getItem('properties'));
    }
    return null;
  }

}
