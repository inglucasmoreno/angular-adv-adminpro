import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Modulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { NotpagefoundComponent } from './notpagefound/notpagefound.component';

const routes: Routes = [

    // path: '/dashboard' PagesRouting
    // path: '/auth' AuthRouting
    // path: '/medicos' MedicosRouting
    // path: '/compras' ComprasRouting
    { path: '', pathMatch: 'full', redirectTo: '/dashboard'},
    { path: '**', component: NotpagefoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
