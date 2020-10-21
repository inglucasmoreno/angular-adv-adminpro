import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Hospital } from 'src/app/models/hospitales.model';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.models';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor( private fb: FormBuilder,
               private hospitalesService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => this.cargarMedico(id) );

    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });
    this.medicoForm.get('hospital').valueChanges
        .subscribe( hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find( hospital => hospital._id === hospitalId );
        });
  }

  cargarMedico(id: string): void {

    if(id === 'nuevo'){
     return;
    }

    this.medicoService.cargarMedicosPorId(id)
        .pipe(delay(100))
        .subscribe( medico => {

          if(!medico){
            this.router.navigateByUrl(`/dashboard/medicos`);
            return;
           }

          const { nombre, hospital: { _id } } = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({nombre, hospital: _id});
        });
  }

  guardarMedico(): void {

    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado){
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };
      this.medicoService.actualizarMedico(data)
          .subscribe( resp => {
            Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
            console.log(resp);
          });
    }else{
      // Crear
      this.medicoService.crearMedico(this.medicoForm.value)
          .subscribe( (resp: any) => {
            Swal.fire('Creado', `${nombre} ha sido creado correctamente`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
          });
    }
  }

  cargarHospitales(): void {
    this.hospitalesService.cargarHospitales()
        .subscribe( hospitales => {
          this.hospitales = hospitales;
        });
  }


}
