import { Component, OnInit, Input } from '@angular/core';
import { ClasificadorService } from '../clasificador.service';
import { Relacion } from './relacion';
import { Par } from './par';


@Component({
  selector: 'app-clasificador',
  templateUrl: './clasificador.component.html',
  styleUrls: ['./clasificador.component.css']
})
export class ClasificadorComponent implements OnInit {
  
  @Input() conjuntoA: string;
  @Input() conjuntoB: string;

  opcionRelaciones = "r";
  opcionFunciones = "f";
  opcionInyectivas= "i";
  opcionSuprayectivas= "s";
  opcionBiyectivas= "b";

  @Input() opcion: string = this.opcionRelaciones;

  salidas: string[] = [];
  esRelacion: string[] = [];
  esFuncion: string[] = [];

  constructor(public clasificadorService: ClasificadorService ) { }

  ngOnInit() {
    
  }

  procesar(){
    this.salidas = [];
    this.clasificadorService.establecerConjuntos(this.conjuntoA, this.conjuntoB);
    let conjuntoRelaciones: Relacion[] = this.clasificadorService.obtenerRelaciones();

    switch (this.opcion) {
      case this.opcionRelaciones:
          this.salidas = this.relacionesSalida(conjuntoRelaciones);
          this.esRelacion = this.convertirBooleanString(this.clasificadorService.esRelacion);
          this.esFuncion = this.convertirBooleanString(this.clasificadorService.esFuncion);
        break;
      case this.opcionFunciones:
          let conjuntoFunciones: Relacion[] = this.clasificadorService.obtenerFunciones(conjuntoRelaciones);
          this.salidas = this.relacionesSalida(conjuntoFunciones);
          this.esRelacion = this.convertirBooleanString(this.clasificadorService.esFuncion);
          this.esFuncion = this.convertirBooleanString(this.clasificadorService.esFuncion);
        break;
      default:
        break;
    }
    
  }

  relacionesSalida(relaciones: Relacion[]): string[]{
    let salidas: string[] = [];

    for (let i = 0; i < relaciones.length; i++) {
      let salida = "{";
      const relacion: Relacion = relaciones[i];
      if (relacion.pares.length === 0) {
        salida += "( ),";
      }
      else{
        for (let j = 0; j < relacion.pares.length; j++) {
          const par: Par = relacion.pares[j];
          salida += "("+par.dominio+","+par.codominio+"),";
        }
      }
      salida = salida.slice(0,-1);
      salida += "}";
      salidas.push(salida);
    }

    return salidas;
  }

  convertirBooleanString(validaciones: boolean[]): string[]{
    let afirmaciones: string[] = [];
    validaciones.forEach(elemento => {
      if(elemento){
        afirmaciones.push("Sí");
      }
      else{
        afirmaciones.push("No");
      }
    });
    return afirmaciones;
  }

  haySolucion(){
    return (this.salidas.length > 0);
  }

  sinConjuntos(){
    return !this.conjuntoA || !this.conjuntoB;
  }

}
