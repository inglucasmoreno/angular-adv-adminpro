import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.models';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando = true;
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService
              ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => {
      this.cargarMedicos();
    });
  }

  buscar( termino: string ): any{

    if (termino.length === 0){
      return this.medicos = this.medicosTemp;
    }

    this.busquedaService.buscar('medicos', termino)
        .subscribe( (resultados: Medico[]) => {
          this.medicos = resultados;
        });
  }

  cargarMedicos(): void{
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.medicosTemp = medicos;
          this.medicos = medicos;
          this.cargando = false;
        });
  }

  borrarMedico(medico: Medico): void{
    Swal.fire({
      title: 'Eliminando medico',
      text: `¿Quieres eliminar a ${medico.nombre}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id)
            .subscribe( () => {
              Swal.fire(
                'Eliminado!',
                `${medico.nombre} eliminado correctamente!`,
                'success'
              );
              this.cargarMedicos();
            });
      }
    });
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

}
