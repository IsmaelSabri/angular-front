import { Edificio } from './../model/edificio';
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
export class EdificioService {

  private edificio$: ReplaySubject<Edificio>=new ReplaySubject<Edificio>();
  public edificio_:Observable<Edificio>=this.edificio$.asObservable();
  private host = environment.apiUrl;
  private httpHeaders=new HttpHeaders({'Content-Type':"application/json"})
  constructor(private http: HttpClient) {}

  /*  Reservado para emitir nuevos valores
  get selectedEdificio$(): Observable<Edificio>{ // :Observable<Edificio>
    return this.edificio_;
  }

  setEdificio$(edificio:Edificio):void{
    this.edificio$.next(edificio);
  }*/

  public addBuilding(formData: FormData): Observable<Edificio>{
    return this.http.post<Edificio>(`${this.host}/buildings/new`, formData);
  }

  public getBuildings(): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(`${this.host}/buildings/list`);
  }

  public addBuildingsToLocalCache(buildings: Edificio[]): void {
    localStorage.setItem('buildings', JSON.stringify(buildings));
  }

  public getBuildingsFromLocalCache(): Edificio[] {
    if (localStorage.getItem('buildings')) {
      return JSON.parse(localStorage.getItem('buildings'));
    }
    return null;
  }

}
