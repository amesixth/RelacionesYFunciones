import { Component, OnInit } from '@angular/core';

import { ClasificadorService } from "src/app/clasificador.service.js";


@Component({
  selector: 'app-clasificador',
  templateUrl: './clasificador.component.html',
  styleUrls: ['./clasificador.component.css']
})
export class ClasificadorComponent implements OnInit {

  constructor(public clasificadorService: ClasificadorService) { }

  ngOnInit() {}

  

}
