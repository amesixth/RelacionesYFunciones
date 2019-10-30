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

  salidas: string[];

  constructor(public clasificadorService: ClasificadorService ) { }

  ngOnInit() {
    
  }

  procesar(){
    this.salidas = this.relacionSalida(this.clasificadorService.obtenerRelaciones(this.conjuntoA, this.conjuntoB));
  }

  relacionSalida(relaciones: Relacion[]): string[]{
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

}
