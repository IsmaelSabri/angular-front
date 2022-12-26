import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UsuarioService } from './service/usuario.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './components/user/user.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { MarkerService } from './service/marker.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutosizeModule } from 'ngx-autosize';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EdificioService } from './service/edificio.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    HomeComponent,
    MainNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationModule,
    NgbModalModule,
    NgbModule,
    IvyCarouselModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxStarRatingModule,
    MatFormFieldModule,
    AutosizeModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  exports:[          // para utilizar componentes en otros modulos
    HomeComponent,
    MainNavComponent
  ],
  providers: [
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    UsuarioService,
    EdificioService,
    MarkerService,
    NgbCarouselConfig,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
