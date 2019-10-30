import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ClasificadorComponent } from './clasificador.component';

@NgModule({
  declarations: [ClasificadorComponent],
  imports: [CommonModule, FormsModule],
  exports: [ClasificadorComponent]
})
export class ClasificadorModule { }
