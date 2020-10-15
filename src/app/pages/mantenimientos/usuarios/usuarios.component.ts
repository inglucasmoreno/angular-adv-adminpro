import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;

  public imgSubs: Subscription;

  constructor(private usuariosService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();  // IMPORTANTE - Se desubscribe para evitar fuga de memoria
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    // Se subscribe al evento de cambio de imagen - Emitido por modal-imagen-component
    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(
          delay(100)
        )
        .subscribe( img => {
          this.cargarUsuarios();
        });
  }

  cargarUsuarios(): void{
    this.cargando = true;
    this.usuariosService.cargarUsuarios(this.desde)
        .subscribe( ({total, usuarios}) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
        });
  }

  cambiarPagina(valor: number): void{
    this.desde += valor;
    if (this.desde < 0){
      this.desde = 0;
    }else if (this.desde > this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar( termino: string ): any{

    if (termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios', termino)
        .subscribe( resultados => {
          this.usuarios = resultados;
        });
  }

  eliminarUsuario(usuario: Usuario): any{

    if (usuario.uid === this.usuariosService.uid){
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(usuario)
            .subscribe( resp => {
              Swal.fire(
                'Borrado!',
                `${usuario.nombre} fue eliminado`,
                'success'
              );
              this.cargarUsuarios();
            });
      }
    });
  }

  cambiarRole(usuario: Usuario): void{
    this.usuariosService.guardarUsuario(usuario)
        .subscribe(resp => {
          console.log(resp);
        });
  }

  abrirModal(usuario: Usuario): void{
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
