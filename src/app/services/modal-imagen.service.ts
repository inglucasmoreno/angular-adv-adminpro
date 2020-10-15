import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  // tslint:disable-next-line: variable-name
  private _ocultarModal = true;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(): boolean {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'no-img'
  ): void {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    if (img.includes('https')){
      this.img = img;
    }else{
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }

  }

  cerrarModal(): void {
    this._ocultarModal = true;
  }

  constructor() { }
}
