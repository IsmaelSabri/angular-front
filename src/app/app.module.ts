import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotifierModule } from 'angular-notifier';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutosizeModule } from 'ngx-autosize';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddComponent } from './pages/add/add.component';
import { ListComponent } from './pages/list/list.component';
import { HomeService } from './service/home.service';
import { CookieService } from 'ngx-cookie-service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { IonicModule } from '@ionic/angular';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import {MatSelectModule} from '@angular/material/select'; 
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PasswordComponent } from './components/password/password.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    HomeComponent,
    ListComponent,
    AddComponent,
    PasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationModule,
    NotifierModule,
    NgbModalModule,
    NgbModule,
    //IvyCarouselModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    AutosizeModule,
    MatCardModule,
    MatCheckboxModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzCollapseModule,
    NzModalModule,
    NzDropDownModule,
    MatToolbarModule,
    NzTabsModule,
    NzGridModule,
    IonicModule,
    MDBBootstrapModule.forRoot(),
    NzSelectModule,
    MatSelectModule,
    MatTableModule,
    NzTableModule,
    MatIconModule,
  ],
  exports: [
    // to get component in another modules
    HomeComponent,
    AddComponent,
    ListComponent,
  ],
  providers: [
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    NgbCarouselConfig,
    CookieService,
    HomeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
