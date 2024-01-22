import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { MatSelectModule } from '@angular/material/select'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PasswordComponent } from './components/password/password.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, GoogleSigninButtonDirective,
          GoogleSigninButtonModule, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { CloudinaryModule } from '@cloudinary/ng';
import { LightboxModule } from 'ngx-lightbox';
import { AdminComponent } from './components/admin/admin.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import es from '@angular/common/locales/es';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
registerLocaleData(es);
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import {SelectButtonModule} from 'primeng/selectbutton';
import {MatSliderModule} from '@angular/material/slider';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import {MatDividerModule} from '@angular/material/divider'; 


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
    AdminComponent,
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
    SocialLoginModule,
    GoogleSigninButtonModule,
    CloudinaryModule,
    LightboxModule,
    NzCarouselModule,
    NzDatePickerModule,
    NzCardModule,
    NzCheckboxModule,
    NzRadioModule,
    NzToolTipModule,
    NzAffixModule,
    NzDividerModule,
    NzBreadCrumbModule,
    NzColorPickerModule,
    NzBadgeModule,
    ModalModule,
    NzSliderModule,
    SelectButtonModule,
    MatSliderModule,
    CardModule,
    DialogModule,
    MultiSelectModule,
    SliderModule,
    CheckboxModule,
    BadgeModule,
    ConfirmPopupModule,
    ButtonModule,
    MatDividerModule,

  ],
  exports: [
    // to get component in another modules
    HomeComponent,
    AddComponent,
    ListComponent,
    AdminComponent,
  ],
  providers: [
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    NgbCarouselConfig,
    CookieService,
    HomeService,
    BsModalService,
    { provide: NZ_I18N, useValue: es_ES },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '791302205764-3n3lhec3dr1qeqcaglllk72j95cjaas1.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
