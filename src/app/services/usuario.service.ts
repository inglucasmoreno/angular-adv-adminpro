import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form-interface';
import { environment } from '../../environments/environment.prod';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form-interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role;
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get headers() {
    return{
      headers: {
        'x-token': this.token
      }
    };
  }

  googleInit(): Promise<any>{
    return new Promise( resolve => {
      console.log('google init');
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '321936206068-pc5svu21d9fcohu31vnm1g4eiqm57o0k.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  guardarLocalStorage( token: string, menu: any ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });

  }

  validarToken(): Observable<boolean>{
    return this.http.get(`${ base_url }/auth/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {  // Permite realizar una accion secundaria
        console.log(resp.token);
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError( error => of(false) ) // Atrapa el error y devuelve un Observable<false>
    );
  }

  crearUsuario( formData: RegisterForm ): Observable<any>{
    return this.http.post(`${ base_url }/usuarios`, formData)
               .pipe(
                  tap( resp => { // Permite realizar una accion secundaria
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
               );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ): Observable<any>{
    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  // Autenticacion Local
  login( formData: LoginForm ): Observable<any>{
    return this.http.post(`${ base_url }/auth`, formData)
               .pipe(
                  tap( resp => { // Permite realizar una accion secundaria
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
               );
  }

  // Autenticacion con Google
  loginGoogle( token ): Observable<any>{
    return this.http.post(`${ base_url }/auth/google`, { token })
               .pipe(
                  tap( resp => { // Permite realizar una accion secundaria
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
               );
  }

  cargarUsuarios( desde: number = 0 ): Observable<any>{
    const url = `${base_url}/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuarios>(url, this.headers)
               .pipe(
                  map(resp => {
                    const usuarios = resp.usuarios.map(
                      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                  );
                  // tslint:disable-next-line: align
                  return {
                    total: resp.total,
                    usuarios
                  };
                 })
               );
  }

  eliminarUsuario( usuario: Usuario ): Observable<any>{
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario( usuario: Usuario): Observable<any>{
    console.log(usuario.uid);
    console.log(usuario);
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

}
