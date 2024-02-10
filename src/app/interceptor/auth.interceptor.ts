import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { TokenApiModel } from '../model/performance/TokenApiModel';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.authenticationService.getToken();

    // this.start.load();
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            //this.toast.warning({detail:"Warning", summary:"Token is expired, Please Login again"});
            //this.router.navigate(['login'])
            //handle
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => err);
      })
    );
  }
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokeApiModel = new TokenApiModel();
    tokeApiModel.AccessToken = this.authenticationService.getToken()!;
    tokeApiModel.RefreshToken = this.authenticationService.getRefreshToken()!;
    return this.authenticationService.renewToken(tokeApiModel).pipe(
      switchMap((data: TokenApiModel) => {
        this.authenticationService.saveRefreshToken(data.RefreshToken);
        this.authenticationService.saveToken(data.AccessToken);
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${data.AccessToken}` },
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toastr.warning(
            'Warning',
            'Token is expired, Please Login again'
          );
          this.router.navigate(['login']);
        });
      })
    );
  }
}
