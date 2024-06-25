import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/productoModel';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
	API_URI = 'http://localhost:8000/producto';
	API_ProductosActivos = 'http://localhost:8000/productos/activos';
	API_ProdXCategoria = 'http://localhost:8000/productos/categoria';
	API_ProdXSubcategoria = 'http://localhost:8000/productos/subcategoria';
  FORMAT_JSON = "?format=json";

  productos: Producto[];

  constructor(private http: HttpClient) { 
    this.productos = [];
  }

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_URI + this.FORMAT_JSON, { headers: this.headers });
  }

  getProductosActivos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_ProductosActivos, { headers: this.headers });
  }
  
  getProductsByCategory(categoriaId: number): Observable<any> {
    return this.http.get(`${this.API_ProdXCategoria}/${categoriaId}/`);
  }

  getProductsBySubcategory(subcategoriaId: number): Observable<any> {
    return this.http.get(`${this.API_ProdXSubcategoria}/${subcategoriaId}/`);
  }
}
