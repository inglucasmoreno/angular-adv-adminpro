import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.models';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  get token(): string {
    return localStorage.getItem('token');
  }

  get headers(): any {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  constructor(private http: HttpClient) { }

  cargarMedicos(): Observable<any> {
    const url = `${base_url}/medicos`;
    return this.http.get<Medico[]>(url, this.headers)
               .pipe(
                 map( (resp: any) => resp.medicos )
               );
  }

  cargarMedicosPorId(id: string): Observable<any> {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get<Medico>(url, this.headers)
               .pipe(
                 map( (resp: any) => resp.medico )
               );
  }

  crearMedico(medico: { nombre: string, hospital: string }): Observable<any> {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico): Observable<any> {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  borrarMedico(id: string): Observable<any>{
    const url = `${base_url}/medicos/${id}`;
    return this.http.delete(url, this.headers);
  }

}
