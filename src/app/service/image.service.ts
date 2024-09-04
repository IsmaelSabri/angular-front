import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Axios } from 'axios-observable';
import { Observable } from 'rxjs';
import { APIKEY } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8',
  });
  constructor() { }

  //Single image
  public uploadSignature(body: FormData, name: string): Observable<any> {
    return Axios.post(`https://api.imgbb.com/1/upload?&key=${APIKEY.imgbb}&name=${name}`, body);
  }

}
