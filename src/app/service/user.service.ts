import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/performance/custom-http-response';
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

  public addNewUser(user: string): Observable<User> {
    return this.http.post<User>(`${this.host}/api/user/new`, user);
  }

  public completeRegistry(user: User): Observable<CustomHttpResponse> {
    return this.http.put<CustomHttpResponse>(`${this.host}/api/user/full`, user, {
      headers: this.httpHeaders,
    });
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
  // after login
  public performUser(user: User): User {
    if (user.profileImageAsString != null || user.profileImageAsString != undefined) {
      user.profileImage = JSON.parse(user.profileImageAsString);
    }
    if (user.brandImageAsString != null || user.brandImageAsString != undefined) {
      user.brandImage = JSON.parse(user.brandImageAsString);
    }
    if (user.likePreferencesAsString === null) {
      user.likePreferences = [];
    } else {
      user.likePreferences = user.likePreferencesAsString.split(',');
    }
    if (user.reviewsAsString != null || user.reviewsAsString != undefined) {
      user.reviews = JSON.parse(user.reviewsAsString);
    }
    if (user.chatsOpenedAsString != null || user.chatsOpenedAsString != undefined) {
      user.chatsOpened = JSON.parse(user.chatsOpenedAsString);
    }
    return user;
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
