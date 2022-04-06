import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedComponent } from './paginated.component';

@NgModule({
  declarations: [PaginatedComponent],
  imports: [CommonModule],
  exports: [PaginatedComponent],
})
export class PaginatedModule {}
