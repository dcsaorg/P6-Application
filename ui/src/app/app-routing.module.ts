import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.guard';
import { AuthService } from './auth/auth.service';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signup', component: SignUpComponent,},
  { path: 'signin', component: SignInComponent,},
  { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule { }
