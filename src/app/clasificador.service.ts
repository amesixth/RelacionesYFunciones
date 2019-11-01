import { Injectable } from '@angular/core';
import { Par } from './clasificador/par';
import { Relacion } from './clasificador/relacion';

@Injectable({
  providedIn: 'root'
})
export class ClasificadorService {
  
  dominio: string[];
  codominio: string[];

  esRelacion: boolean[] = [];
  esFuncion: boolean[] = [];
  esInyectiva: boolean[] = [];
  esSuprayectiva: boolean[] = [];
  esBiyectiva: boolean[] = [];

  constructor() {}

  convertirEntradaArreglo(entrada: string): string[]{
    let conjunto: string[] = entrada.split(",");
    let resultado: string[] = [];

    let index = 0;
    while (index < conjunto.length) {
      if (!this.esDuplicado(conjunto.slice(index+1), conjunto[index])) { 
        resultado.push(conjunto[index]);
      }
      index++;
    }
    return resultado;
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
    this.esInyectiva = this.marcarFuncionesInyectivas(relaciones);
    this.esSuprayectiva = this.marcarFuncionesSuprayectiva(relaciones, this.esFuncion);
    this.esBiyectiva = this.marcarFuncionesBiyectivas(relaciones, this.esInyectiva, this. esSuprayectiva);
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

  marcarFuncionesInyectivas(potencia: Relacion[]): boolean[]{
    let funcionesInyectivas: boolean[] = [];

    for (let index = 0; index < potencia.length; index++) {
      if(this.esFuncion[index]){
        const elemento = potencia[index];
        let codominio: string[] = [];
        let esInyectiva: boolean = true;
        for (let j = 0; j < elemento.pares.length; j++) {
          const par = elemento.pares[j];
          if(this.esDuplicado(codominio,par.codominio)){
            esInyectiva = false;
          }
          codominio.push(par.codominio);
        }
        funcionesInyectivas.push(esInyectiva);
      }
      else{
        funcionesInyectivas.push(false);
      }
    }

    return funcionesInyectivas;
  }

  verifica(vector: boolean[]): boolean{
    let resultado: boolean = true;
    vector.forEach(elemento => {
      if(!elemento){
        resultado = false;
      }
    });
    return resultado;
  }

  marcarFuncionesSuprayectiva(relaciones: Relacion[], funciones: boolean[]): boolean[]{
    //Todas las relaciones
    for (let i = 0; i < relaciones.length; i++) {
      //Si es una función, entonces verifica
      if(funciones[i]){
        let aux: boolean[] = [];//this.initAux(this.codominio.length);
        for(let i=0;i<this.codominio.length;i++){
          aux.push(false);
        }
        for (let j = 0; j < relaciones[i].pares.length; j++) {
          for(let k = 0; k < this.codominio.length; k++){
            if(relaciones[i].pares[j].codominio == this.codominio[k]){
              aux[k] = true;
            }
          }
        }
        this.esSuprayectiva[i] = this.verifica(aux);
      }else{
        this.esSuprayectiva[i] = false;
      }
    }
    return this.esSuprayectiva;
  }

  marcarFuncionesBiyectivas(relaciones: Relacion[], esInyectiva: boolean[], esSuprayectiva: boolean[]): boolean[]{
    let biyectivas: boolean[] = [];
    for (let i = 0; i < relaciones.length; i++) {
      if(esInyectiva[i] && esSuprayectiva[i]){
        biyectivas.push(true);
      }else{
        biyectivas.push(false);
      }
    }
    return biyectivas;
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
