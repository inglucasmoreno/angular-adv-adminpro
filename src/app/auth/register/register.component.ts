import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  // Formulario Reactivo
  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    password2: ['', Validators.required ],
    terminos: [false, Validators.required ],
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) { }

  crearUsuario(): void {
    this.formSubmitted = true;
    console.log(this.registerForm.value);
    // console.log(this.registerForm);

    // Formulario invalido
    if (this.registerForm.invalid){
      return;
    }

    // Formulario valido
    // Registrar usuario en base de datos
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {
          this.router.navigateByUrl('/');
        }, (err) => {
          // Si sucede un errosr
          Swal.fire('Error', err.error.msg, 'error');
        });

  }

  campoNoValido( campo: string ): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  aceptarTerminos(): boolean{
    if(!this.registerForm.get('terminos').value && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string){
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({ noEsIgual: true });
      }

    }
  }



}
