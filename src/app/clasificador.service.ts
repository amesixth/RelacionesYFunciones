import { Injectable } from '@angular/core';
import { Par } from './clasificador/par';
import { Relacion } from './clasificador/relacion';

@Injectable({
  providedIn: 'root'
})
export class ClasificadorService {
  dominio: string[];
  codominio: string[];

  producto: Par[] = [];
  potencia: Relacion[];
  
  constructor() { }

  convertirEntradaArreglo(entrada: string): string[]{
    return entrada.split(",");
  }

  productoCartesiano(dominio: string[], codominio: string[]): Par[]{
    let producto: Par[] = [];

    dominio.forEach(elemento1 => {
      codominio.forEach(elemento2 => {
        const par: Par = { dominio : elemento1, codominio : elemento2};
        producto.push(par);
      });
    });

    return producto;
  }

  conjuntoPotencia(conjunto: Par[]): Relacion[]{
    let relaciones: Relacion[];
    
    const tamPotencia = Math.pow(2,conjunto.length);
    relaciones = this.inicializarRelaciones(relaciones,tamPotencia);

    for (let i = 0; i < tamPotencia; i++) {
      let subConjunto: Par[] = [];
      for (let j = 0; j < conjunto.length; j++) {
        if ((i & (1 << j)) > 0) {
          subConjunto.push(conjunto[j]);
        }
      }
      let relacion: Relacion = { pares : subConjunto};
      relaciones.push(relacion);
    }
    relaciones = relaciones.slice(1);
    return relaciones;
  }

  inicializarRelaciones(relaciones: Relacion[], cantidad: number): Relacion[]{
    let relacionesIni: Relacion[] = [];
    let relacion: Relacion = { pares : []}
    relacionesIni.push(relacion);
    return relacionesIni;  
  }

  obtenerRelaciones(entrada1: string, entrada2: string): Relacion[]{
    this.dominio = this.convertirEntradaArreglo(entrada1);
    this.codominio = this.convertirEntradaArreglo(entrada2);
    return this.conjuntoPotencia(this.productoCartesiano(this.dominio, this.codominio));
  }
}
