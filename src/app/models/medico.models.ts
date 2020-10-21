import { Hospital } from 'src/app/models/hospitales.model';

interface _medicoUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Medico {
    constructor(
        public _id: string,
        public nombre: string,
        public img?: string,
        public usuario?: _medicoUser,
        public hospital?: Hospital,
    ){}
}
