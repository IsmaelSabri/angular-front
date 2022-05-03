import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Marker } from '../model/marker';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private host = environment.apiUrl;
  private httpHeaders=new HttpHeaders({'Content-Type':"application/json"})

  constructor(private http: HttpClient) {}

  public getMarkers(): Observable<Marker[]> {
    return this.http.get<Marker[]>(`${this.host}/map/list`);
  }
//, {headers:this.httpHeaders}
  public addMarker(formData: FormData): Observable<Marker> {
    return this.http.post<Marker>(`${this.host}/map/new`, formData);
  }

  public addMarkersToLocalCache(markers: Marker[]): void {
    localStorage.setItem('markers', JSON.stringify(markers));
  }

  public getMarkersFromLocalCache(): Marker[] {
    if (localStorage.getItem('markers')) {
      return JSON.parse(localStorage.getItem('markers'));
    }
    return null;
  }
}
