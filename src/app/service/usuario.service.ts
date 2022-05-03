import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({providedIn: 'root'})
export class UsuarioService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.host}/user/list`);
  }

  public addNewUser(formData: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.host}/user/add`, formData);
  }

  public updateUsuario(formData: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<Usuario>> {
    return this.http.post<Usuario>(`${this.host}/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUsuario(usuarioname: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${usuarioname}`);
  }

  public addUsuariosToLocalCache(usuarios: Usuario[]): void {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  public getUsuariosFromLocalCache(): Usuario[] {
    if (localStorage.getItem('usuarios')) {
        return JSON.parse(localStorage.getItem('usuarios'));
    }
    return null;
  }

  public createUsuarioFormDate(loggedInUsername: string, usuario: Usuario, fotoPerfilUrl: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('nombre', usuario.nombre);
    formData.append('primerApellido', usuario.primerApellido);
    formData.append('username', usuario.username);
    formData.append('email', usuario.email);
    formData.append('rol', usuario.rol);
    formData.append('fotoPerfilUrl', fotoPerfilUrl);
    formData.append('isActive', JSON.stringify(usuario.active));
    formData.append('isNonLocked', JSON.stringify(usuario.notLocked));
    return formData;
  }

}
