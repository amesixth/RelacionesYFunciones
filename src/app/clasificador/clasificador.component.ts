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
  opcionEvaluar = "e";

  @Input() opcion: string = this.opcionRelaciones;

  @Input() expresionAEvaluar: string;

  salidas: string[] = [];

  esRelacion: string[] = [];
  esFuncion: string[] = [];
  esInyectiva: string[] = [];
  esSuprayectiva: string[] = [];
  esBiyectiva: string[] = [];

  constructor(public clasificadorService: ClasificadorService ) { }

  ngOnInit() {}

  procesar(){
    this.salidas = [];
    this.clasificadorService.establecerConjuntos(this.conjuntoA, this.conjuntoB);
    let conjuntoRelaciones: Relacion[] = this.clasificadorService.obtenerRelaciones();

    switch (this.opcion) {
      case this.opcionRelaciones:
        this.salidas = this.relacionesSalida(conjuntoRelaciones,this.clasificadorService.esRelacion);
        break;
      case this.opcionFunciones:
        this.salidas = this.relacionesSalida(conjuntoRelaciones,this.clasificadorService.esFuncion);
        break;
      case this.opcionInyectivas:
        this.salidas = this.relacionesSalida(conjuntoRelaciones,this.clasificadorService.esInyectiva);
        break;
      case this.opcionSuprayectivas:
        this.salidas = this.relacionesSalida(conjuntoRelaciones,this.clasificadorService.esSuprayectiva);
        break;
      case this.opcionBiyectivas:
        this.salidas = this.relacionesSalida(conjuntoRelaciones,this.clasificadorService.esBiyectiva);
        break;
      case this.opcionEvaluar:
        this.salidas.push(this.evaluarExpresion(this.relacionesSalida(conjuntoRelaciones,this.clasificadorService.esRelacion), this.expresionAEvaluar));
        break;
      default:
        break;
    }
  }

  evaluarExpresion(relaciones: string[], expresionAEvaluar: string): string{
    this.inicializarCaracteristicas();
    for (let i = 0; i < relaciones.length; i++) {
      let auxRelacion:string = relaciones[i].slice(1,relaciones[i].length-1);
      console.log(auxRelacion);
      console.log(expresionAEvaluar);
      if(auxRelacion==expresionAEvaluar){
        this.establecerCaracteristicas(i);
        return expresionAEvaluar;
      }
    }
    this.esRelacion.push("No");
    this.esFuncion.push("No");
    this.esInyectiva.push("No");
    this.esSuprayectiva.push("No");
    this.esBiyectiva.push("No");
    return expresionAEvaluar;
  }

  relacionesSalida(relaciones: Relacion[], caracteristica:boolean[]): string[]{
    let salidas: string[] = [];
    this.inicializarCaracteristicas();

    for (let i = 0; i < relaciones.length; i++) {  
      if (caracteristica[i]) {
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
        this.establecerCaracteristicas(i);
      }
    }
    return salidas;

  }

  inicializarCaracteristicas(){
    this.esRelacion = [];
    this.esFuncion = [];
    this.esInyectiva = [];
    this.esSuprayectiva = [];
    this.esBiyectiva = [];
  }
  establecerCaracteristicas(indice: number){
    this.esRelacion.push(this.convertirBooleanString(this.clasificadorService.esRelacion[indice]));
    this.esFuncion.push(this.convertirBooleanString(this.clasificadorService.esFuncion[indice]));
    this.esInyectiva.push(this.convertirBooleanString(this.clasificadorService.esInyectiva[indice]));
    this.esSuprayectiva.push(this.convertirBooleanString(this.clasificadorService.esSuprayectiva[indice]));
    this.esBiyectiva.push(this.convertirBooleanString(this.clasificadorService.esBiyectiva[indice]));
  }

  convertirBooleanString(validacion: boolean): string{
    let respuesta: string = "";
    if (validacion) {
      respuesta = "Sí";
    } else {
      respuesta =  "No";
    }
    return respuesta;
  }

  haySolucion(){
    return (this.salidas.length > 0);
  }

  sinConjuntos(){
    return !this.conjuntoA || !this.conjuntoB;
  }

}
