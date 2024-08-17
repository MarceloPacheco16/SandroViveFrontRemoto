import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoriaModel';
import { Subcategoria } from '../models/subcategoriaModel';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  
	API_Categoria = 'http://localhost:8000/categoria';
	API_Categoria_Mod = 'http://localhost:8000/categorias';
	API_Subcategoria = 'http://localhost:8000/subcategoria';
	// API_Subcategoria = 'http://localhost:8000/subcategorias';
  FORMAT_JSON = "?format=json";

  id_categoria: number;
  id_subcategoria: number;

  constructor(private http: HttpClient) { 
    this.id_categoria = -1;
    this.id_subcategoria = -1;
    // this.categoria = {
    //   id: 1,
    //   nombre: "",
    //   descripcion: "",
    //   activo: 0
    // };
    // this.subcategoria = {
    //   id: 1,
    //   nombre: "",
    //   descripcion: "",
    //   categoria: -1,
    //   activo: 0
    // };
  }
  
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Método para obtener todas las categorías activas
    getCategorias(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(`${this.API_Categoria}`);
    }

    postCategoria(CategoriaNueva: Categoria): Observable<Categoria[]> {
      return this.http.post<Categoria[]>(`${this.API_Categoria}`, CategoriaNueva);
    }
    
    putCategoria(CategoriaActual: Categoria): Observable<Categoria[]> {
      return this.http.put<Categoria[]>(`${this.API_Categoria}/${CategoriaActual.id}`, CategoriaActual);
    }

    // postClientes(nuevoCliente: Cliente): Observable<any> {
    //   return this.http.post<any>(this.API_URI + this.FORMAT_JSON, nuevoCliente, { headers: this.headers });
    // }

    // Método para obtener todas las categorías activas
    getSubcategorias(): Observable<Subcategoria[]> {
      return this.http.get<Subcategoria[]>(`${this.API_Subcategoria}`);
    }

    // Método para obtener todas las categorías activas
    getCategoriasActivas(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(`${this.API_Categoria_Mod}/activas/`);
    }
  
    // Método para obtener todas las subcategorías activas por categoría
    getSubcategoriasActivasPorCategoria(categoriaId: number): Observable<Subcategoria[]> {
      return this.http.get<Subcategoria[]>(`${this.API_Categoria_Mod}/${categoriaId}/subcategorias/activas/`);
    }
}
