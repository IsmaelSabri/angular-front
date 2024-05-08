import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/performance/custom-http-response';
import { APIKEY } from 'src/environments/environment.prod';
import Axios from 'axios-observable';

@Injectable({ providedIn: 'root' })
export class UserService {
  private host = environment.apiUrl;
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8',
  });

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/api/user/all`);
  }

  public getUserByUserId(id: string): Observable<User> {
    return this.http.get<User>(`${this.host}/api/user/check/${id}`);
  }

  public addNewUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/api/user/new`, user);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/api/user/updateProfileImage`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  public completeRegistry(user: User): Observable<CustomHttpResponse> {
    return this.http.put<CustomHttpResponse>(`${this.host}/api/user/full/${user.id}`, user, {
      headers: this.httpHeaders,
    });
  }

  public checkUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.host}/api/user/check/${userId}`);
  }

  public checkEmailExists(email: string): Observable<User> {
    return this.http.get<User>(`${this.host}/api/user/checkemail/${email}`);
  }

  public resetPassword(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/api/user/reset-password`, user);
  }

  public saveNewPassword(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/api/user/save-newpassword`, user);
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

  public updateUser(user: User, id: string): Observable<User> {
    return this.http.put<User>(`${this.host}/api/user/${id}`, user);
  }

  public createUserFormData(loggedInUsername: string, user: User, profileImageAsString: File): FormData {
    const formData = new FormData();
    formData.append('profileImageAsString', JSON.stringify(profileImageAsString));
    formData.append('username', loggedInUsername);
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('phone', user.phone);
    formData.append('email', user.email);
    formData.append('rol', user.role);
    formData.append('isActive', JSON.stringify(user.isactive));
    formData.append('isNonLocked', JSON.stringify(user.isnotLocked));
    return formData;
  }

  public uploadSignature(body: FormData, name: string): Observable<any> {
    return Axios.post(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${name}`, body);
  }

  public getRole() {
    return this.role$.asObservable();
  }

  public setRole(role: string) {
    this.role$.next(role);
  }

  public getFullName() {
    return this.fullName$.asObservable();
  }

  public setFullName(fullname: string) {
    this.fullName$.next(fullname)
  }

}
