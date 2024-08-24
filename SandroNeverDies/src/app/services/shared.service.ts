import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private actionSource = new Subject<void>();
  private filterByCategorySubcategorySource = new Subject<void>();
  private filterByNameSource = new Subject<string>();


  constructor() { }

  // Observable que pueden suscribirse los componentes
  action$ = this.actionSource.asObservable();

  filtroPorCategoriaYSubcategoria$ = this.filterByCategorySubcategorySource.asObservable();
  filtroPorNombre$ = this.filterByNameSource.asObservable();

  // Método para activar la acción
  triggerAction() {
    this.actionSource.next();
  }

  filtrarPorCategoriaYSubcategoria() {
    this.filterByCategorySubcategorySource.next();
  }

  filtrarPorNombre(nombreProducto: string) {
    this.filterByNameSource.next(nombreProducto);
  }
}
