import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoriaModel';
import { Subcategoria } from '../models/subcategoriaModel';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  
  // Usar la URL base desde el archivo de entorno
  API_Categoria = `${environment.apiUrl}/categoria`;
  API_Categoria_Mod = `${environment.apiUrl}/categorias`;
  API_Subcategoria = `${environment.apiUrl}/subcategoria`;
	// API_Categoria = 'http://localhost:8000/categoria';
	// API_Categoria_Mod = 'http://localhost:8000/categorias';
	// API_Subcategoria = 'http://localhost:8000/subcategoria';
	// // API_Subcategoria = 'http://localhost:8000/subcategorias';
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

    // Método para obtener todas las Subcategorías
    getSubcategorias(): Observable<Subcategoria[]> {
      return this.http.get<Subcategoria[]>(`${this.API_Subcategoria}`);
    }

    postSubcategoria(SubcategoriaNueva: Subcategoria): Observable<Subcategoria[]> {
      console.log(SubcategoriaNueva);
      return this.http.post<Subcategoria[]>(`${this.API_Subcategoria}`, SubcategoriaNueva);
    }
    
    putSubcategoria(SubcategoriaActual: Subcategoria): Observable<Subcategoria[]> {
      console.log(SubcategoriaActual);
      return this.http.put<Subcategoria[]>(`${this.API_Subcategoria}/${SubcategoriaActual.id}`, SubcategoriaActual);
    }

    // Método para obtener todas las Categorías activas
    getCategoriasActivas(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(`${this.API_Categoria_Mod}/activas/`);
    }
  
    // Método para obtener todas las Subcategorías activas por Categoría
    getSubcategoriasActivasPorCategoria(categoriaId: number): Observable<Subcategoria[]> {
      return this.http.get<Subcategoria[]>(`${this.API_Categoria_Mod}/${categoriaId}/subcategorias/activas/`);
    }
}
