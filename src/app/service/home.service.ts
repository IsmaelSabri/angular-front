import { Home } from '../model/home';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private property$: ReplaySubject<Home> = new ReplaySubject<Home>();
  public vivienda_: Observable<Home> = this.property$.asObservable();
  private host = environment.apiUrl;
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8',
    //'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
  });
  constructor(private http: HttpClient) { }

  public gethome(id: string, home: string): Observable<Home> {
    return this.http.post<Home>(`${this.host}/api/home/${id}`, home, {
      headers: this.httpHeaders,
    });
  }

  public getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(`${this.host}/api/home/all`);
  }

  public getHomesByQuery(url: string): Observable<Home[]> {
    return this.http.get<Home[]>(`${this.host}/api/home/query?filters=${url}`);
  }

  public addHome(home: string): Observable<Home> {
    return this.http.post<Home>(`${this.host}/api/home/new`, home, {
      headers: this.httpHeaders,
    });
  }
  // update
  public updateHome(home: Home): Observable<Home> {
    return this.http.put<Home>(`${this.host}/api/home/home`, home);
  }

  public updateFlat(home: Home): Observable<Home> {
    return this.http.put<Home>(`${this.host}/api/home/flat`, home);
  }

  public updateHouse(home: Home): Observable<Home> {
    return this.http.put<Home>(`${this.host}/api/home/house`, home);
  }

  public updateRoom(home: Home): Observable<Home> {
    return this.http.put<Home>(`${this.host}/api/home/room`, home);
  }

  public updateNewProject(home: Home): Observable<Home> {
    return this.http.put<Home>(`${this.host}/api/home/new-project`, home);
  }

  public updateHolidayRent(home: Home): Observable<Home> {
    return this.http.put<Home>(`${this.host}/api/home/holiday-rent`, home);
  }
  // local storage
  public getHomeFromLocalCache(): Home {
    if (localStorage.getItem('currentBuilding')) {
      return JSON.parse(localStorage.getItem('currentBuilding'));
    }
    return null;
  }

  public addHomeToLocalCache(home: Home) {
    localStorage.removeItem('currentBuilding');
    localStorage.setItem('currentBuilding', JSON.stringify(home));
  }
  // perform from db
  public performHome(home: Home): Home {
    if (home.energyCertAsString) {
      home.energyCert = JSON.parse(home.energyCertAsString);
    }
    if (home.imagesAsString) {
      home.images = JSON.parse(home.imagesAsString);
    }
    if (home.proImageAsString) {
      home.proImage = JSON.parse(home.proImageAsString);
    }
    if (home.likeMeForeverAsString === null) {
      home.likeMeForever = [];
    } else {
      home.likeMeForever = home.likeMeForeverAsString.split(',');
    }
    return home;
  }
  // delete
  public deleteHome(id: string) {
    return this.http.delete(`${this.host}/api/home/${id}`, { responseType: 'text' });
  }

}
