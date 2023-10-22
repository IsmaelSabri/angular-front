import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/performance/custom-http-response';

@Injectable({providedIn: 'root'})
export class UserService {
  private host = environment.apiUrl;
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/api/user/all`);
  }

  public addNewUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/api/user/new`, user);
  }

  public updateUser(formData: FormData, id:string): Observable<User> {
    return this.http.put<User>(`${this.host}/api/user/${id}`, formData);
  }

  public resetPassword(id: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/api/user/update/${id}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/api/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public completeRegistry(user:User): Observable<CustomHttpResponse> {
    return this.http.put<CustomHttpResponse>(`${this.host}/api/user/fullregistry/${user.id}`, user);
  }

  public checkEmailExists(userId:string) : Observable<User>{
    return this.http.get<User>(`${this.host}/api/user/check/${userId}`);
  }

  public deleteUser(id: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/api/user/${id}`);
  }

  public addUsersToLocalCache(usuarios: User[]): void {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('usuarios')) {
        return JSON.parse(localStorage.getItem('usuarios'));
    }
    return null;
  }

  public createUserFormDate(loggedInUsername: string, user: User, fotoPerfilUrl: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('nombre', user.firstname);
    formData.append('primerApellido', user.lastname);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('rol', user.role);
    formData.append('fotoPerfilUrl', fotoPerfilUrl);
    formData.append('isActive', JSON.stringify(user.isactive));
    formData.append('isNonLocked', JSON.stringify(user.isnotLocked));
    return formData;
  }

  public getRole(){
    return this.role$.asObservable();
  }

  public setRole(role:string){
    this.role$.next(role);
  }

  public getFullName(){
    return this.fullName$.asObservable();
  }

  public setFullName(fullname:string){
    this.fullName$.next(fullname)
  }

}
