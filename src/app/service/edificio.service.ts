import { Edificio } from './../model/edificio';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {
  edificio: Edificio = new Edificio();
  private edificio$=new BehaviorSubject<Edificio>(this.edificio);
  private host = environment.apiUrl;
  private httpHeaders=new HttpHeaders({'Content-Type':"application/json"})
  constructor(private http: HttpClient) {}

  get selectedEdificio$():Observable<Edificio>{
    return this.edificio$.asObservable();
  }

  setEdificio(edificio:Edificio):void{
    this.edificio$.next(edificio);
  }
}
