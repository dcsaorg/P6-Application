import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './auth/auth-guard.guard';
import {AuthService} from './auth/auth.service';
import {DashboardComponent} from './view/dashboard/dashboard.component';

const guards: any[] = [AuthGuard];

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: guards},
  {path: 'transportcall/:id', component: DashboardComponent, canActivate: guards},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule {
}
