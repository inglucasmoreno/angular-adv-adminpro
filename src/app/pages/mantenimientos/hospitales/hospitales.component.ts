import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospitales.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando = true;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService) { }

    ngOnDestroy(): void {
      this.imgSubs.unsubscribe();  // IMPORTANTE - Se desubscribe para evitar fuga de memoria
    }

    ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => {
      this.cargarHospitales();
    });
  }

  cargarHospitales(): void {
      this.cargando = true;
      this.hospitalService.cargarHospitales()
          .subscribe( hospitales => {
            this.hospitales = hospitales;
            this.cargando = false;
          });
  }

  guardarCambios(hospital: Hospital): void{
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
        .subscribe( () => {
          Swal.fire('Actualizado', `${hospital.nombre} actualizado!`, 'success');
        });
  }

  eliminarHospital(hospital: Hospital): void{
    Swal.fire({
      title: 'Estas seguro?',
      text: `Quieres eliminar ${hospital.nombre}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id)
            .subscribe( () => {
              Swal.fire(
                'Eliminado!',
                `${hospital.nombre} eliminado!`,
                'success'
              );
              this.cargarHospitales();
            });
      }
    });
  }

  async abrirSweetaler() {
    const { value } = await Swal.fire<string>({
      title: 'Creando hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value.trim().length > 0){
      this.hospitalService.crearHospital(value)
          .subscribe((resp: any) => {
            this.hospitales.push(resp.hospital);  // Se evita realizar otra consulta
            Swal.fire('Hospital creado', `${resp.hospital.nombre} creado correctamente`, 'success');
          });
    }

  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

}
