import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './components/user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { VlogComponent } from './components/vlog/vlog.component';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { PasswordComponent } from './components/password/password.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserProComponent } from './components/user-pro/user-pro.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'vlog', component: VlogComponent },
  { path: 'add/:id', component: AddComponent },
  { path: 'home', component: HomeComponent },
  { path: '_es', component: ListComponent },
  { path: 'pass', component: PasswordComponent },
  { path: 'user-pro', component: UserProComponent, canActivate: [AuthenticationGuard] },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard] }, 
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
