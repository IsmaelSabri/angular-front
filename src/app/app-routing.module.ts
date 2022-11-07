import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './components/user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MainNavComponent } from './components/main-nav/main-nav.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'add', component: MainNavComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard] }, 
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
