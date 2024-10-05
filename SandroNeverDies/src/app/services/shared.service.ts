import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private actionSource = new Subject<void>();
  private filterByCategorySubcategorySource = new Subject<void>();
  private filterByNameSource = new Subject<string>();


  // Observable que pueden suscribirse los componentes
  action$ = this.actionSource.asObservable();

  filtroPorCategoriaYSubcategoria$ = this.filterByCategorySubcategorySource.asObservable();
  filtroPorNombre$ = this.filterByNameSource.asObservable();
  
  private cantProductosCarrito = new BehaviorSubject<number>(0);
  currentCantProductosCarrito = this.cantProductosCarrito.asObservable();
  
  constructor() { }
  
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
  
  // Método para actualizar la cantidad de productos
  actualizarCantProductosCarrito(cant: number): void {
    this.cantProductosCarrito.next(cant);
  }
}
