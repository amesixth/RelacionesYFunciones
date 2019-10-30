import { Injectable } from '@angular/core';
import { Par } from './clasificador/par';
import { Relacion } from './clasificador/relacion';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ClasificadorService {
  
  dominio: string[];
  codominio: string[];

  esRelacion: boolean[] = [];
  esFuncion: boolean[] = [];

  constructor() {}

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
    relaciones = this.inicializarRelaciones();

    for (let i = 0; i < tamPotencia; i++) {
      let subConjunto: Par[] = [];
      for (let j = 0; j < conjunto.length; j++) {
        if ((i & (1 << j)) > 0) {
          subConjunto.push(conjunto[j]);
        }
      }
      let relacion: Relacion = { pares : subConjunto};
      relaciones.push(relacion);
      this.esRelacion.push(true);
    }
    relaciones = relaciones.slice(1);
    return relaciones;
  }

  inicializarRelaciones(): Relacion[]{
    let relacionesIni: Relacion[] = [];
    let relacion: Relacion = { pares : []}
    relacionesIni.push(relacion);
    return relacionesIni;  
  }

  obtenerRelaciones(): Relacion[]{
    let relaciones: Relacion[] = this.conjuntoPotencia(this.productoCartesiano(this.dominio, this.codominio));
    this.esFuncion = this.marcarFunciones(relaciones);
    return relaciones;
  }

  marcarFunciones(potencia: Relacion[]): boolean[]{
    let funciones: boolean[] = [];
    
    potencia.forEach(elemento => {
     
      if (elemento.pares.length === this.dominio.length) {
        let dominio: string[] = [];
        let esFuncion: boolean = true;
        elemento.pares.forEach(par => {
          if(this.esDuplicado(dominio,par.dominio)){
            esFuncion = false;
          }
          dominio.push(par.dominio);
        });
        funciones.push(esFuncion);
      }
      else{
        funciones.push(false);
      }
    });

    return funciones;
  }

  obtenerFunciones(relaciones: Relacion[]): Relacion[]{
    let funciones: Relacion[] = [];
    let esFuncion:boolean[] = [];
    for (let index = 0; index < relaciones.length; index++) {
      if(this.esFuncion[index]){
        funciones.push(relaciones[index]);
        esFuncion.push(true);
      }
    }
    this.esFuncion = esFuncion;
    return funciones;
  }

  esDuplicado(cadena: string[], valor: string): boolean{
    let resultado:boolean = false;
    cadena.forEach(elemento => {
      if(elemento === valor){
        resultado = true;
      }
    });
    return resultado;
  }

  establecerConjuntos(conjuntoA: string, conjuntoB: string){
    this.dominio = this.convertirEntradaArreglo(conjuntoA);
    this.codominio = this.convertirEntradaArreglo(conjuntoB);
  }
}
