import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoriaModel';
import { Subcategoria } from '../models/subcategoriaModel';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  
	API_Categoria = 'http://localhost:8000/categorias';
	// API_Subcategoria = 'http://localhost:8000/subcategorias';
  FORMAT_JSON = "?format=json";

  constructor(private http: HttpClient) { }
  
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Método para obtener todas las categorías activas
    getCategoriasActivas(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(`${this.API_Categoria}/activas/`);
    }
  
    // Método para obtener todas las subcategorías activas por categoría
    getSubcategoriasActivasPorCategoria(categoriaId: number): Observable<Subcategoria[]> {
      return this.http.get<Subcategoria[]>(`${this.API_Categoria}/${categoriaId}/subcategorias/activas/`);
    }
}
