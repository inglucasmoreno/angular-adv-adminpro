import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
  { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Grafica #1' } },
  { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' } },
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
  { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' } },
  { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busqueda' } },

  // Mantenimiento
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales' } },
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Medicos' } },
  { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de Medicos' } },

  // Rutas de Admin
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuarios' } },
];

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
